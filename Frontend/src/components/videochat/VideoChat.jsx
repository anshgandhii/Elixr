import React, { useState, useEffect, useRef } from 'react';
import ThemeToggler from '../theme/ThemeToggler';
import { FaBars, FaVideo, FaVideoSlash, FaMicrophone, FaMicrophoneSlash, FaDesktop, FaHome, FaForward, FaPaperPlane, FaTimes, FaPaperclip } from 'react-icons/fa';
import { FiSun } from 'react-icons/fi';

const VideoChat = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showThemeToggler, setShowThemeToggler] = useState(false);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [screenSharing, setScreenSharing] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [file, setFile] = useState(null);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const chatContainerRef = useRef(null);
  const fileInputRef = useRef(null);
  const mediaStreamRef = useRef(null); // Ref to store the media stream

  const handleThemeIconClick = () => {
    setShowThemeToggler((prev) => !prev);
  };

  useEffect(() => {
    const initializeWebRTC = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        mediaStreamRef.current = stream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing media devices:', error);
      }
    };

    initializeWebRTC();
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const toggleVideo = () => {
    setVideoEnabled((prev) => {
      const enabled = !prev;
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getVideoTracks().forEach((track) => {
          track.enabled = enabled;
        });
      }
      return enabled;
    });
  };

  const toggleAudio = () => {
    setAudioEnabled((prev) => {
      const enabled = !prev;
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getAudioTracks().forEach((track) => {
          track.enabled = enabled;
        });
      }
      return enabled;
    });
  };

  const toggleScreenShare = () => {
    setScreenSharing(!screenSharing);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() || file) {
      const newMsg = { text: newMessage.trim(), sender: 'You', file: file };
      setMessages([...messages, newMsg]);
      setNewMessage('');
      setFile(null);
      setTimeout(() => {
        setMessages((prev) => [...prev, { text: 'This is a simulated response.', sender: 'Remote User' }]);
      }, 1000);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <div className="flex h-screen bg-base-100 text-base-content">
      {/* Sidebar with Chat */}
      <div className={`fixed inset-y-0 left-0 z-30 w-full sm:w-80 bg-base-200 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:relative md:translate-x-0 flex flex-col shadow-lg`}>
        <div className="p-4 border-b border-base-300 flex justify-between items-center bg-base-100">
          <h2 className="text-2xl font-semibold">Elixr</h2>
          <button
            className="p-2 rounded-full relative"
            onClick={handleThemeIconClick}
          >
            <FiSun className="text-xl text-base" />
          </button>
          <button onClick={toggleSidebar} className="md:hidden focus:outline-none">
            <FaTimes size={24} />
          </button>
          {showThemeToggler && (
            <div className="absolute top-full right-0 mt-2">
              <ThemeToggler />
            </div>
          )}
        </div>
        <nav className="flex-grow overflow-y-auto flex flex-col">
          <a href="#" className="flex items-center mt-4 py-2 px-6 hover:bg-base-300 transition-colors duration-200">
            <FaForward className="mr-3" />
            Skip
          </a>
          <a href="#" className="flex items-center mt-2 py-2 px-6 hover:bg-base-300 transition-colors duration-200">
            <FaHome className="mr-3" />
            Home
          </a>
          <div className="mt-8 px-6 flex-grow flex flex-col">
            <h3 className="text-lg font-semibold mb-4">Chat</h3>
            <div ref={chatContainerRef} className="flex-grow overflow-y-auto bg-base-100 rounded-lg p-2 mb-4 shadow-inner">
              {messages.map((msg, index) => (
                <div key={index} className={`mb-2 ${msg.sender === 'You' ? 'text-right' : 'text-left'}`}>
                  <span className={`inline-block rounded-lg px-3 py-2 text-sm max-w-xs break-words ${
                    msg.sender === 'You' ? 'bg-primary text-primary-content' : 'bg-secondary text-secondary-content'
                  }`}>
                    <strong>{msg.sender}:</strong> {msg.text}
                    {msg.file && (
                      <div className="mt-1 text-xs opacity-80">
                        Attached: {msg.file.name}
                      </div>
                    )}
                  </span>
                </div>
              ))}
            </div>
            <form onSubmit={handleSendMessage} className="flex flex-col">
              <div className="flex items-center mb-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-grow px-3 py-2 bg-base-100 rounded-l-lg text-base-content border border-base-300 focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button type="button" onClick={() => fileInputRef.current.click()} className="bg-base-300 px-3 py-2 text-base-content hover:bg-base-200 transition-colors duration-200">
                  <FaPaperclip />
                </button>
                <button type="submit" className="bg-primary px-3 py-2 rounded-r-lg text-primary-content hover:bg-primary-focus transition-colors duration-200">
                  <FaPaperPlane />
                </button>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
              />
              {file && (
                <div className="text-sm opacity-70 mb-2 truncate">
                  File: {file.name}
                </div>
              )}
            </form>
          </div>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        <header className="bg-base-100 shadow-md">
          <div className="flex items-center justify-between p-4">
            <button onClick={toggleSidebar} className="text-base-content focus:outline-none focus:text-base-content md:hidden">
              <FaBars className="h-6 w-6" />
            </button>
            <h1 className="text-xl font-semibold">Video Call</h1>
            <div>{/* Placeholder for additional header content */}</div>
          </div>
        </header>

        {/* Video call area */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-base-200 p-4">
          <div className="flex flex-wrap justify-center gap-4">
            <div className="relative w-full max-w-2xl aspect-video bg-base-300 rounded-lg overflow-hidden shadow-lg">
              <video ref={remoteVideoRef} className="w-full h-full object-cover" autoPlay playsInline />
              <div className="absolute bottom-4 right-4 w-48 h-36 bg-base-100 rounded-lg overflow-hidden shadow-md">
                <video ref={localVideoRef} className="w-full h-full object-cover" autoPlay playsInline muted />
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex justify-center mt-6 space-x-4">
            <button onClick={toggleVideo} className={`btn btn-circle btn-lg ${videoEnabled ? 'btn-primary' : 'btn-error'}`}>
              {videoEnabled ? <FaVideo /> : <FaVideoSlash />}
            </button>
            <button onClick={toggleAudio} className={`btn btn-circle btn-lg ${audioEnabled ? 'btn-primary' : 'btn-error'}`}>
              {audioEnabled ? <FaMicrophone /> : <FaMicrophoneSlash />}
            </button>
            <button onClick={toggleScreenShare} className="btn btn-circle btn-lg btn-primary">
              <FaDesktop />
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default VideoChat;
