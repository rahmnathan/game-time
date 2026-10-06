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

    const formatDateTime = (dateTimeStr) => {
        const date = new Date(dateTimeStr);
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit'
        });
    };

    const parseGames = (gamesStr) => {
        if (!gamesStr) return [];
        return gamesStr.split(',').map(g => g.trim()).filter(g => g);
    };

    const getCurrentSlotGames = () => {
        const slot = slots.find(s => s.id === joinForm.slotId);
        return slot ? parseGames(slot.games) : [];
    };

    if (loading) {
        return <div className="container"><p>Loading...</p></div>;
    }

    return (
        <div className="container">
            <header>
                <h1>Game Time</h1>
                <p className="subtitle">Hi, I'm Nathan on the 4th floor. Join me for cards in the lobby!</p>
            </header>

            {error && <div className="error">{error}</div>}
            {successMessage && <div className="success">{successMessage}</div>}

            {slots.length === 0 ? (
                <p className="no-slots">No upcoming game times yet. Check back soon!</p>
            ) : (
                <div className="slots">
                    {slots.map(slot => (
                        <div key={slot.id} className="slot-card">
                            <div className="slot-header">
                                <span className="slot-time">{formatDateTime(slot.dateTime)}</span>
                                <span className="slot-location">{slot.location}</span>
                            </div>

                            {slot.games && (
                                <div className="game-tags">
                                    {parseGames(slot.games).map((game, idx) => (
                                        <span key={idx} className="game-tag">{game}</span>
                                    ))}
                                </div>
                            )}

                            <div className="participant-info">
                                {slot.participantCount === 0 ? (
                                    <span className="empty">Be the first to join!</span>
                                ) : (
                                    <span className="count">
                                        {slot.participantCount} {slot.participantCount === 1 ? 'person' : 'people'} in:
                                        {' '}{slot.participantNames.join(', ')}
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
                                    />
                                    <select
                                        value={joinForm.preferredGame}
                                        onChange={e => setJoinForm({ ...joinForm, preferredGame: e.target.value })}
                                        className="game-select"
                                    >
                                        <option value="">Any game is fine</option>
                                        {getCurrentSlotGames().map((game, idx) => (
                                            <option key={idx} value={game}>{game}</option>
                                        ))}
                                    </select>
                                    <div className="form-buttons">
                                        <button type="submit" disabled={joining}>
                                            {joining ? 'Joining...' : "I'm in!"}
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
                                    Join this time
                                </button>
                            )}

                            {slot.groupChatLink && (
                                <a href={slot.groupChatLink} className="chat-link" target="_blank" rel="noopener noreferrer">
                                    Join the group chat
                                </a>
                            )}
                        </div>
                    ))}
                </div>
            )}

            <footer>
                <p>Questions? I'm in unit 412.</p>
            </footer>
        </div>
    );
};

export default App;
