import React, { useState, useEffect } from 'react';

const App = () => {
    const [slots, setSlots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [joinForm, setJoinForm] = useState({ slotId: null, firstName: '', phone: '' });
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
                    phone: joinForm.phone
                })
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.detail || 'Failed to join');
            }

            setSuccessMessage(`You're in! We'll text you at ${joinForm.phone} with updates.`);
            setJoinForm({ slotId: null, firstName: '', phone: '' });
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

    if (loading) {
        return <div className="container"><p>Loading...</p></div>;
    }

    return (
        <div className="container">
            <header>
                <h1>Game Time</h1>
                <p className="subtitle">Hi, I'm Nathan on the 4th floor. Join me for cards in the lobby!</p>
                <p className="games">Games: Monopoly Deal, SkyJo, Skip-Bo, Cribbage</p>
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

                            {slot.games && <p className="slot-games">{slot.games}</p>}

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
                                    <input
                                        type="tel"
                                        placeholder="Phone (for updates only)"
                                        value={joinForm.phone}
                                        onChange={e => setJoinForm({ ...joinForm, phone: e.target.value })}
                                        required
                                    />
                                    <div className="form-buttons">
                                        <button type="submit" disabled={joining}>
                                            {joining ? 'Joining...' : "I'm in!"}
                                        </button>
                                        <button
                                            type="button"
                                            className="cancel"
                                            onClick={() => setJoinForm({ slotId: null, firstName: '', phone: '' })}
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
                <p>Your phone number is only used to notify you about this event. It's never shared.</p>
            </footer>
        </div>
    );
};

export default App;
