// Mock Data API for development
export async function getPracticeProblems() {
  try {
    const response = await fetch('/data/practice-problems.json')
    if (!response.ok) {
      throw new Error('Failed to fetch practice problems')
    }
    return await response.json()
  } catch (error) {
    console.error('Error fetching practice problems:', error)
    // Fallback data
    return {
      total: 156,
      problems: [],
      categories: [],
      userProgress: { solved: [], attempted: [], bookmarked: [], stats: {} }
    }
  }
}

export async function getClassData() {
  try {
    const response = await fetch('/data/class-data.json')
    if (!response.ok) {
      throw new Error('Failed to fetch class data')
    }
    return await response.json()
  } catch (error) {
    console.error('Error fetching class data:', error)
    // Fallback data
    return {
      userStats: {},
      classes: [],
      recentAssignments: []
    }
  }
}

export async function getAIConversations() {
  try {
    const response = await fetch('/data/ai-conversations.json')
    if (!response.ok) {
      throw new Error('Failed to fetch AI conversations')
    }
    return await response.json()
  } catch (error) {
    console.error('Error fetching AI conversations:', error)
    // Fallback data
    return {
      conversations: [],
      aiProfiles: [],
      quickActions: [],
      userPreferences: {}
    }
  }
}

export async function submitAssignment(assignmentData) {
  // Mock submission API
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        submissionId: Date.now(),
        message: 'Assignment submitted successfully'
      })
    }, 1000)
  })
}

export async function runCode(codeData) {
  // Mock code execution API
  return new Promise((resolve) => {
    setTimeout(() => {
      const results = [
        { status: 'success', output: 'Output: 42\nExecution time: 0.123s\nMemory: 1024KB' },
        { status: 'error', output: 'Runtime Error: Index out of bounds at line 5' }
      ]
      resolve({
        success: true,
        result: results[Math.floor(Math.random() * results.length)]
      })
    }, 1500)
  })
}

export async function sendAIMessage(message, conversationId = null) {
  // Mock AI response API
  return new Promise((resolve) => {
    setTimeout(() => {
      const responses = [
        '这是一个很好的问题！让我来为你详细解释...',
        '基于你提到的问题，我建议可以从以下几个方面来理解和解决...',
        '这个问题涉及到多个概念，我来为你逐一分析...',
        '让我通过一个具体的例子来帮助你理解这个概念...'
      ]
      resolve({
        success: true,
        response: responses[Math.floor(Math.random() * responses.length)],
        conversationId: conversationId || Date.now()
      })
    }, 2000)
  })
}