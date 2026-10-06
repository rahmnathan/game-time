import React, { useState, useEffect } from 'react';

const App = () => {
    const [slots, setSlots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [joinForm, setJoinForm] = useState({ slotId: null, firstName: '', preferredGame: '' });
    const [joining, setJoining] = useState(false);
    const [successMessage, setSuccessMessage] = useState(null);

    useEffect(() => {
        fetchSlots();
    }, []);

    const fetchSlots = async () => {
        try {
            const response = await fetch('/api/slots');
            if (!response.ok) throw new Error('Failed to load slots');
            const data = await response.json();
            setSlots(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleJoin = async (e) => {
        e.preventDefault();
        setJoining(true);
        setError(null);

        try {
            const response = await fetch(`/api/slots/${joinForm.slotId}/join`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    firstName: joinForm.firstName,
                    preferredGame: joinForm.preferredGame || null
                })
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.detail || 'Failed to join');
            }

            setSuccessMessage(`You're in, ${joinForm.firstName}! See you there.`);
            setJoinForm({ slotId: null, firstName: '', preferredGame: '' });
            fetchSlots();
        } catch (err) {
            setError(err.message);
        } finally {
            setJoining(false);
        }
    };

    const parseGames = (gamesStr) => {
        if (!gamesStr) return [];
        return gamesStr.split(',').map(g => g.trim()).filter(g => g);
    };

    const getCurrentSlotGames = () => {
        const slot = slots.find(s => s.id === joinForm.slotId);
        return slot ? parseGames(slot.games) : [];
    };

    const groupSlotsByDay = (slots) => {
        const grouped = {};
        slots.forEach(slot => {
            const date = new Date(slot.dateTime);
            const dayKey = date.toDateString();
            if (!grouped[dayKey]) {
                grouped[dayKey] = {
                    date: date,
                    dayName: date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase(),
                    dayNum: date.getDate(),
                    month: date.toLocaleDateString('en-US', { month: 'short' }),
                    slots: []
                };
            }
            grouped[dayKey].slots.push(slot);
        });
        return Object.values(grouped).sort((a, b) => a.date - b.date);
    };

    const formatTime = (dateTimeStr) => {
        const date = new Date(dateTimeStr);
        return date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit'
        });
    };

    const isToday = (date) => {
        const today = new Date();
        return date.toDateString() === today.toDateString();
    };

    const isTomorrow = (date) => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return date.toDateString() === tomorrow.toDateString();
    };

    const getDayLabel = (dayData) => {
        if (isToday(dayData.date)) return 'TODAY';
        if (isTomorrow(dayData.date)) return 'TOMORROW';
        return dayData.dayName;
    };

    if (loading) {
        return <div className="container"><p>Loading...</p></div>;
    }

    const groupedSlots = groupSlotsByDay(slots);

    return (
        <div className="container">
            <header>
                <h1>Game Time</h1>
                <p className="subtitle">Join us for games in the lobby!</p>
            </header>

            {error && <div className="error">{error}</div>}
            {successMessage && <div className="success">{successMessage}</div>}

            {slots.length === 0 ? (
                <p className="no-slots">No upcoming game times yet. Check back soon!</p>
            ) : (
                <div className="calendar">
                    {groupedSlots.map(dayData => (
                        <div key={dayData.date.toISOString()} className="day-column">
                            <div className={`day-header ${isToday(dayData.date) ? 'today' : ''}`}>
                                <span className="day-name">{getDayLabel(dayData)}</span>
                                <span className="day-date">{dayData.month} {dayData.dayNum}</span>
                            </div>
                            <div className="day-slots">
                                {dayData.slots.map(slot => (
                                    <div
                                        key={slot.id}
                                        className={`slot-card ${joinForm.slotId === slot.id ? 'expanded' : ''}`}
                                    >
                                        <div className="slot-time-badge">
                                            {formatTime(slot.dateTime)}
                                        </div>

                                        {slot.location && (
                                            <div className="slot-location">{slot.location}</div>
                                        )}

                                        {slot.games && (
                                            <div className="game-tags">
                                                {parseGames(slot.games).map((game, idx) => (
                                                    <span key={idx} className="game-tag">{game}</span>
                                                ))}
                                            </div>
                                        )}

                                        <div className="participant-info">
                                            {slot.participantCount === 0 ? (
                                                <span className="empty">Be the first!</span>
                                            ) : (
                                                <span className="count">
                                                    {slot.participantCount} going
                                                    <span className="names">{slot.participantNames.join(', ')}</span>
                                                </span>
                                            )}
                                        </div>

                                        {joinForm.slotId === slot.id ? (
                                            <form onSubmit={handleJoin} className="join-form">
                                                <input
                                                    type="text"
                                                    placeholder="First name"
                                                    value={joinForm.firstName}
                                                    onChange={e => setJoinForm({ ...joinForm, firstName: e.target.value })}
                                                    required
                                                    maxLength={50}
                                                    autoFocus
                                                />
                                                <select
                                                    value={joinForm.preferredGame}
                                                    onChange={e => setJoinForm({ ...joinForm, preferredGame: e.target.value })}
                                                    className="game-select"
                                                >
                                                    <option value="">Any game</option>
                                                    {getCurrentSlotGames().map((game, idx) => (
                                                        <option key={idx} value={game}>{game}</option>
                                                    ))}
                                                </select>
                                                <div className="form-buttons">
                                                    <button type="submit" disabled={joining}>
                                                        {joining ? '...' : "I'm in!"}
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="cancel"
                                                        onClick={() => setJoinForm({ slotId: null, firstName: '', preferredGame: '' })}
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </form>
                                        ) : (
                                            <button
                                                className="join-button"
                                                onClick={() => setJoinForm({ ...joinForm, slotId: slot.id })}
                                            >
                                                Join
                                            </button>
                                        )}

                                        {slot.groupChatLink && (
                                            <a href={slot.groupChatLink} className="chat-link" target="_blank" rel="noopener noreferrer">
                                                Group chat
                                            </a>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <footer>
                <p>See you there!</p>
            </footer>
        </div>
    );
};

export default App;
