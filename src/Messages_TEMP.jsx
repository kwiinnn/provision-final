import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './messages.css';

function Messages() {
    const navigate = useNavigate();
    const [selectedContact, setSelectedContact] = useState(1); // Default to first contact

    // Mock Data for Contacts
    const contacts = [
        { id: 1, name: 'ProVision Insights AI Chatbot', role: 'AI Assistant', time: '05:30 PM', active: true, avatar: 'src/assets/provisionlogo.png', isAi: true }, // Assuming you have this logo
        { id: 2, name: 'Supplier 306', role: 'Hey Lorem Ipsum', time: '05:30 PM', active: false, avatar: 'https://ui-avatars.com/api/?name=Supplier+306&background=random' },
        { id: 3, name: 'Supplier 404', role: 'Hey Lorem Ipsum', time: '05:30 PM', active: false, avatar: 'https://ui-avatars.com/api/?name=Supplier+404&background=random' },
        { id: 4, name: 'Supplier 123', role: 'Hey Lorem Ipsum', time: '05:30 PM', active: false, avatar: 'https://ui-avatars.com/api/?name=Supplier+123&background=random' },
    ];

    // Close handler to go back to previous page
    const handleClose = (e) => {
        // Close only if clicking the overlay background, not the modal itself
        if (e.target.className === 'messages-overlay') {
            navigate(-1); // Go back in history
        }
    };

    return (
        <div className="messages-overlay" onClick={handleClose}>
            <div className="messages-modal">
                
                {/* LEFT SIDEBAR: CONTACTS */}
                <div className="msg-sidebar">
                    <h2 className="msg-title">Messages</h2>
                    
                    <div className="msg-search">
                        <span className="search-icon">🔍</span>
                        <input type="text" placeholder="Search or start a new chat" />
                    </div>

                    <div className="contact-list">
                        {contacts.map(contact => (
                            <div 
                                key={contact.id} 
                                className={`contact-item ${selectedContact === contact.id ? 'active' : ''}`}
                                onClick={() => setSelectedContact(contact.id)}
                            >
                                <img src={contact.avatar} alt={contact.name} className="contact-avatar" />
                                <div className="contact-info">
                                    <div className="contact-header">
                                        <span className="contact-name">{contact.name}</span>
                                        {contact.isAi && <span className="star-icon">☆</span>}
                                    </div>
                                    <p className="contact-role">{contact.role}</p>
                                    <p className="contact-time">🕒 Today | {contact.time}</p>
                                </div>
                                <span className="favorite-star">☆</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* RIGHT SIDE: CHAT AREA */}
                <div className="msg-chat-area">
                    
                    {/* Chat Header */}
                    <div className="chat-header">
                        <div className="chat-header-left">
                            <img src="src/assets/provisionlogo.png" alt="AI" className="header-avatar" />
                            <span className="header-name">ProVision Insights AI Chatbot</span>
                        </div>
                        <div className="chat-header-actions">
                            <button className="action-btn">☆</button>
                            <button className="action-btn">🔍</button>
                            <button className="action-btn">⋮</button>
                        </div>
                    </div>

                    {/* Chat Messages */}
                    <div className="chat-messages">
                        <div className="message received">
                            <div className="msg-bubble">Hello! What can I do for you today?</div>
                            <span className="msg-time">04:45 PM</span>
                        </div>

                        <div className="message sent">
                            <div className="msg-bubble sent-bubble">
                                Hello! can you please give me a list of Cacao suppliers in Davao City with reasonable prices?
                            </div>
                            <span className="msg-time">04:45 PM</span>
                        </div>

                        <div className="message received">
                            <div className="msg-bubble large-bubble">
                                <p>Sure here are the list of Cacao Suppliers in Davao City:</p>
                                <br/>
                                <strong>1. Malagos Agri-Ventures Corporation</strong>
                                <ul>
                                    <li>Description: Bean-to-bar chocolate maker with its own farm in Malagos, Davao City.</li>
                                    <li>Products: Fine-flavor cacao beans, roasted nibs, tablea, cocoa butter, chocolate bars.</li>
                                </ul>
                                <br/>
                                <strong>2. Cacao Culture Farms</strong>
                                <ul>
                                    <li>Description: Social enterprise based in Davao City, supporting local cacao farmers.</li>
                                    <li>Products: Cacao beans (dried), tablea, cacao nibs.</li>
                                </ul>
                                <br/>
                                <a href="#" className="see-more">SEE MORE</a>
                            </div>
                            <span className="msg-time">04:46 PM</span>
                        </div>
                    </div>

                    {/* Chat Input */}
                    <div className="chat-input-area">
                        <button className="emoji-btn">😊</button>
                        <input type="text" placeholder="Type your message here ..." />
                    </div>

                </div>
            </div>
        </div>
    );
}

export default Messages;