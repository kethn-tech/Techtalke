// Client/src/components/code-editor/LiveUsers.jsx
import PropTypes from 'prop-types';
import { UserCircleIcon } from '@heroicons/react/24/solid';
import { motion, AnimatePresence } from 'framer-motion';

const LiveUsers = ({ participants, typingUsers = new Set() }) => {
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700">
      <h3 className="text-white font-medium mb-3 flex items-center">
        <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
        Live Users ({participants.length})
      </h3>
      
      <div className="space-y-2">
        <AnimatePresence>
          {participants.map((participant) => (
            <motion.div
              key={participant.userId}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center space-x-3 p-2 rounded-lg bg-gray-700/30 hover:bg-gray-700/50 transition-colors relative"
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium relative"
                style={{ backgroundColor: participant.color }}
              >
                {participant.username.charAt(0).toUpperCase()}
                
                {/* Online indicator */}
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-gray-800"></div>
              </div>
              
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <p className="text-white text-sm font-medium">
                    {participant.username}
                  </p>
                  
                  {/* Typing indicator */}
                  <AnimatePresence>
                    {typingUsers.has(participant.userId) && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="flex items-center space-x-1"
                      >
                        <div className="flex space-x-1">
                          <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                          <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                          <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                        </div>
                        <span className="text-blue-400 text-xs">typing</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                
                <div className="flex items-center space-x-2 text-gray-400 text-xs">
                  <span>
                    Line {participant.cursor?.line || 1}, Col {participant.cursor?.column || 1}
                  </span>
                  
                  {/* Cursor indicator */}
                  <div 
                    className="w-2 h-2 rounded-full animate-pulse"
                    style={{ backgroundColor: participant.color }}
                  ></div>
                </div>
              </div>
              
              {/* Connection status */}
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      
      {participants.length === 0 && (
        <motion.div 
          className="text-center py-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <UserCircleIcon className="w-8 h-8 text-gray-500 mx-auto mb-2" />
          <p className="text-gray-400 text-sm">No other users online</p>
          <p className="text-gray-500 text-xs mt-1">Share the session link to invite others</p>
        </motion.div>
      )}
      
      {/* Session stats */}
      {participants.length > 0 && (
        <motion.div 
          className="mt-4 pt-3 border-t border-gray-700/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex justify-between text-xs text-gray-400">
            <span>Active collaborators</span>
            <span>{participants.length}</span>
          </div>
          {typingUsers.size > 0 && (
            <div className="flex justify-between text-xs text-blue-400 mt-1">
              <span>Currently typing</span>
              <span>{typingUsers.size}</span>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

LiveUsers.propTypes = {
  participants: PropTypes.arrayOf(
    PropTypes.shape({
      userId: PropTypes.string.isRequired,
      username: PropTypes.string.isRequired,
      color: PropTypes.string.isRequired,
      cursor: PropTypes.shape({
        line: PropTypes.number,
        column: PropTypes.number,
      }),
    })
  ).isRequired,
  typingUsers: PropTypes.instanceOf(Set),
};

export default LiveUsers;