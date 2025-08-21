// Server/controllers/CodeController.js - PRODUCTION HOTFIX
const CodeSession = require('../models/CodeSessionModel');

const createSession = async (req, res) => {
  try {
    const { title, language, isPublic } = req.body;
    
    // CRITICAL FIX: Always create unique sessions to prevent conflicts
    const sessionId = `${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
    
    const session = new CodeSession({
      sessionId,
      title: title || `Code Session ${new Date().toLocaleTimeString()}`,
      language: language || 'javascript',
      isPublic: isPublic || false,
      createdBy: req.user.id,
      code: getDefaultCode(language || 'javascript')
    });
    
    await session.save();
    console.log(`Created unique session: ${sessionId}`);

    return res.status(201).json({
      success: true,
      session: {
        sessionId: session.sessionId,
        title: session.title,
        language: session.language,
        code: session.code,
        participants: session.participants || []
      }
    });
  } catch (error) {
    console.error('Create session error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

const joinSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    const session = await CodeSession.findOne({ sessionId, isActive: true });

    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }

    // Update access time for cleanup
    session.lastModified = new Date();
    await session.save();

    return res.json({
      success: true,
      session: {
        sessionId: session.sessionId,
        title: session.title,
        language: session.language,
        code: session.code,
        participants: session.participants || []
      }
    });
  } catch (error) {
    console.error('Join session error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getDefaultCode = (language) => {
  const templates = {
    javascript: `// TechTalke Real-time Code Collaboration
console.log("Hello, World!");

function welcome(name) {
  return \`Welcome \${name} to our live coding session!\`;
}

// Start coding - changes sync in real-time!
welcome("Developer");`,

    python: `# TechTalke Real-time Code Collaboration
print("Hello, World!")

def welcome(name):
    return f"Welcome {name} to our live coding session!"

# Start coding - changes sync in real-time!
welcome("Developer")`,

    java: `// TechTalke Real-time Code Collaboration
public class LiveCoding {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
        System.out.println(welcome("Developer"));
    }
    
    public static String welcome(String name) {
        return "Welcome " + name + " to our live coding session!";
    }
}`,

    cpp: `// TechTalke Real-time Code Collaboration
#include <iostream>
#include <string>
using namespace std;

string welcome(string name) {
    return "Welcome " + name + " to our live coding session!";
}

int main() {
    cout << "Hello, World!" << endl;
    cout << welcome("Developer") << endl;
    return 0;
}`
  };
  
  return templates[language] || templates.javascript;
};

module.exports = {
  createSession,
  joinSession
};