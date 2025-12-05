# 章节作业混合模式 - JSON修改详细示例

## 概述

本文档提供具体的JSON示例，展示如何修改Course JSON结构来支持章节作为作业模式。

---

## 示例1：完整的Mixed Mode课程JSON

```json
{
  "id": "course_001",
  "type": "course",
  "metadata": {
    "version": "1.0",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-15T10:30:00Z",
    "createdBy": "teacher_001"
  },
  "basicInfo": {
    "title": "软件工程导论",
    "description": "本课程介绍软件工程的基本概念和实践方法",
    "cover": "https://cdn.example.com/courses/course_001.jpg",
    "duration": 48,
    "level": "intermediate",
    "teacher": {
      "id": "teacher_001",
      "name": "李教授",
      "avatar": "https://cdn.example.com/avatars/teacher_001.jpg"
    },
    "tags": ["软件工程", "编程", "计算机"]
  },
  "schedule": {
    "startDate": "2024-08-31",
    "endDate": "2025-06-30",
    "publishStatus": "published"
  },
  
  "chapters": [
    {
      "id": "chapter_001",
      "number": 1,
      "title": "第一章：软件工程基础",
      "description": "介绍软件工程的基本概念",
      "order": 1,
      
      "homeworkMode": {
        "enabled": true,
        "type": "mixed",
        "description": "完成本章学习后完成课后练习",
        "releaseDate": "2024-09-01T00:00:00Z",
        "dueDate": "2024-09-07T23:59:59Z",
        "pointsMultiplier": 1.0,
        "settings": {
          "allowLateSubmission": true,
          "latePenalty": 5,
          "randomOrder": false,
          "immediateGrading": true,
          "showCorrectAnswers": true,
          "reviewAfterSubmit": true
        }
      },
      
      "sections": [
        {
          "id": "section_001",
          "number": "1.1",
          "title": "软件工程概述",
          "description": "什么是软件工程",
          "order": 1,
          "contentType": "video",
          "contentUrl": "https://video.example.com/section_001.mp4",
          "duration": 1800,
          
          "sectionExercise": {
            "enabled": true,
            "exerciseId": "exercise_001",
            "questions": 5,
            "optional": false,
            "displayMode": "inline"
          },
          
          "resources": {
            "materials": [
              {
                "id": "material_001",
                "type": "pdf",
                "title": "课件讲义",
                "url": "https://cdn.example.com/materials/material_001.pdf"
              }
            ],
            "attachments": []
          },
          
          "practice": {
            "practiceId": "practice_001",
            "questions": 5,
            "optional": false
          }
        },
        {
          "id": "section_002",
          "number": "1.2",
          "title": "软件开发过程",
          "description": "软件开发的主要过程和步骤",
          "order": 2,
          "contentType": "video",
          "contentUrl": "https://video.example.com/section_002.mp4",
          "duration": 2400,
          
          "sectionExercise": {
            "enabled": true,
            "exerciseId": "exercise_002",
            "questions": 4,
            "optional": false,
            "displayMode": "modal"
          },
          
          "resources": {
            "materials": [],
            "attachments": []
          },
          
          "practice": {
            "practiceId": "practice_002",
            "questions": 4,
            "optional": false
          }
        }
      ]
    }
  ],
  
  "exercises": [
    {
      "id": "exercise_001",
      "chapterId": "chapter_001",
      "sectionId": "section_001",
      "title": "第一节课后练习",
      "description": "考查软件工程概述的核心知识点",
      "type": "chapter_exercise",
      "difficulty": "easy",
      "displayMode": "inline",
      "metadata": {
        "createdAt": "2024-08-01T00:00:00Z",
        "createdBy": "teacher_001"
      },
      "questions": [
        {
          "id": "question_001",
          "type": "single",
          "questionText": "什么是软件工程的三要素？",
          "score": 5,
          "difficulty": "easy",
          "order": 1,
          "options": [
            {
              "id": "opt_a",
              "value": "A",
              "text": "方法、工具、过程"
            },
            {
              "id": "opt_b",
              "value": "B",
              "text": "代码、文档、测试"
            },
            {
              "id": "opt_c",
              "value": "C",
              "text": "需求、设计、实现"
            },
            {
              "id": "opt_d",
              "value": "D",
              "text": "计划、执行、监控"
            }
          ],
          "correctAnswer": "A",
          "explanation": "软件工程的三要素是方法、工具和过程。方法是指导软件开发的基本原理和技术，工具是支持软件开发的辅助手段，过程是组织和管理软件开发的方式。",
          "knowledgePoints": ["软件工程基础"]
        },
        {
          "id": "question_002",
          "type": "multiple",
          "questionText": "软件生命周期包括哪些阶段？",
          "score": 10,
          "difficulty": "medium",
          "order": 2,
          "options": [
            {
              "id": "opt_a",
              "value": "A",
              "text": "需求分析"
            },
            {
              "id": "opt_b",
              "value": "B",
              "text": "系统设计"
            },
            {
              "id": "opt_c",
              "value": "C",
              "text": "编码实现"
            },
            {
              "id": "opt_d",
              "value": "D",
              "text": "测试维护"
            }
          ],
          "correctAnswers": ["A", "B", "C", "D"],
          "explanation": "软件生命周期是从需求分析开始，经过系统设计、编码实现、测试验证，最后到维护阶段的完整过程。",
          "knowledgePoints": ["软件生命周期"]
        },
        {
          "id": "question_003",
          "type": "fill",
          "questionText": "软件工程的目标是提高软件的___和___。",
          "score": 5,
          "difficulty": "easy",
          "order": 3,
          "correctAnswers": ["质量", "生产效率"],
          "explanation": "软件工程强调通过科学的方法提高软件的质量和开发效率。",
          "knowledgePoints": ["软件工程基础"]
        },
        {
          "id": "question_004",
          "type": "single",
          "questionText": "下列哪个不是软件工程的主要活动？",
          "score": 5,
          "difficulty": "medium",
          "order": 4,
          "options": [
            {
              "id": "opt_a",
              "value": "A",
              "text": "需求分析和规格说明"
            },
            {
              "id": "opt_b",
              "value": "B",
              "text": "软件设计"
            },
            {
              "id": "opt_c",
              "value": "C",
              "text": "硬件维修"
            },
            {
              "id": "opt_d",
              "value": "D",
              "text": "测试和质量保证"
            }
          ],
          "correctAnswer": "C",
          "explanation": "软件工程的主要活动包括需求分析、设计、编码、测试等，但不包括硬件维修。",
          "knowledgePoints": ["软件工程基础"]
        },
        {
          "id": "question_005",
          "type": "essay",
          "questionText": "请阐述软件工程与一般程序设计的主要区别。",
          "score": 15,
          "difficulty": "hard",
          "order": 5,
          "referenceAnswer": "软件工程和程序设计的主要区别包括：\n1. 范围不同：软件工程涉及整个软件生命周期，而程序设计只是其中的一部分\n2. 方法论：软件工程强调系统的方法和过程管理，程序设计侧重于代码实现\n3. 规模不同：软件工程处理大规模复杂系统，程序设计可能只涉及小规模项目\n4. 团队合作：软件工程强调团队协作和沟通，程序设计可能是单人工作\n5. 质量控制：软件工程有严格的质量管理体系",
          "knowledgePoints": ["软件工程概念"]
        }
      ],
      "statistics": {
        "totalQuestions": 5,
        "totalScore": 40,
        "submissionCount": 25,
        "averageScore": 32,
        "completionRate": 92
      }
    },
    {
      "id": "exercise_002",
      "chapterId": "chapter_001",
      "sectionId": "section_002",
      "title": "第二节课后练习",
      "description": "考查软件开发过程的理解",
      "type": "chapter_exercise",
      "difficulty": "medium",
      "displayMode": "modal",
      "metadata": {
        "createdAt": "2024-08-05T00:00:00Z",
        "createdBy": "teacher_001"
      },
      "questions": [
        {
          "id": "question_201",
          "type": "single",
          "questionText": "瀑布模型的主要特点是什么？",
          "score": 5,
          "difficulty": "easy",
          "order": 1,
          "options": [
            {
              "id": "opt_a",
              "value": "A",
              "text": "线性顺序进行，前一阶段完成后才能进入下一阶段"
            },
            {
              "id": "opt_b",
              "value": "B",
              "text": "各阶段可以并行进行"
            },
            {
              "id": "opt_c",
              "value": "C",
              "text": "不需要文档"
            },
            {
              "id": "opt_d",
              "value": "D",
              "text": "快速迭代和频繁发布"
            }
          ],
          "correctAnswer": "A",
          "explanation": "瀑布模型是经典的软件开发过程模型，其主要特点是线性顺序进行，各个阶段依次进行，前一个阶段的输出是后一个阶段的输入。",
          "knowledgePoints": ["开发过程模型"]
        },
        {
          "id": "question_202",
          "type": "multiple",
          "questionText": "敏捷开发的特点包括哪些？",
          "score": 10,
          "difficulty": "medium",
          "order": 2,
          "options": [
            {
              "id": "opt_a",
              "value": "A",
              "text": "快速迭代"
            },
            {
              "id": "opt_b",
              "value": "B",
              "text": "强调与客户的沟通"
            },
            {
              "id": "opt_c",
              "value": "C",
              "text": "灵活应对变化"
            },
            {
              "id": "opt_d",
              "value": "D",
              "text": "强调完整的前期文档"
            }
          ],
          "correctAnswers": ["A", "B", "C"],
          "explanation": "敏捷开发强调快速迭代、与客户频繁沟通、灵活应对需求变化。与传统瀑布模型不同，敏捷开发不强调完整的前期文档。",
          "knowledgePoints": ["开发过程模型"]
        },
        {
          "id": "question_203",
          "type": "fill",
          "questionText": "在敏捷开发中，最小的工作单位通常被称为___。",
          "score": 5,
          "difficulty": "easy",
          "order": 3,
          "correctAnswers": ["用户故事", "User Story"],
          "explanation": "在敏捷开发中，用户故事（User Story）是表达软件功能需求的一种方式，是最小的工作单位。",
          "knowledgePoints": ["敏捷开发"]
        },
        {
          "id": "question_204",
          "type": "essay",
          "questionText": "比较瀑布模型和敏捷开发的优缺点，并说明它们各自适用的场景。",
          "score": 20,
          "difficulty": "hard",
          "order": 4,
          "referenceAnswer": "瀑布模型的优点：\n1. 结构清晰，易于管理\n2. 文档完整，便于维护\n3. 适合需求明确的项目\n\n瀑布模型的缺点：\n1. 不能适应需求变化\n2. 后期发现问题成本高\n3. 交付周期长\n\n敏捷开发的优点：\n1. 快速应对需求变化\n2. 早期发现问题\n3. 频繁交付价值\n\n敏捷开发的缺点：\n1. 文档不完整\n2. 需要客户参与\n3. 团队配合要求高\n\n适用场景：\n瀑布模型：需求明确、变化小的大型项目\n敏捷开发：需求不明确、变化频繁的项目",
          "knowledgePoints": ["开发过程模型"]
        }
      ],
      "statistics": {
        "totalQuestions": 4,
        "totalScore": 40,
        "submissionCount": 22,
        "averageScore": 28,
        "completionRate": 88
      }
    }
  ]
}
```

---

## 示例2：学生答题提交结构

当学生完成章节练习后，提交以下数据：

```json
{
  "id": "student_exercise_001",
  "studentId": "student_001",
  "courseId": "course_001",
  "chapterId": "chapter_001",
  "sectionId": "section_001",
  "exerciseId": "exercise_001",
  "type": "chapter_exercise",
  
  "submission": {
    "submittedAt": "2024-09-05T10:30:00Z",
    "status": "graded",
    "totalScore": 35,
    "maxScore": 40,
    "percentage": 87.5,
    "passed": true,
    "submittedCount": 1
  },
  
  "answers": [
    {
      "questionId": "question_001",
      "userAnswer": "A",
      "correctAnswer": "A",
      "isCorrect": true,
      "score": 5,
      "answerTime": 8
    },
    {
      "questionId": "question_002",
      "userAnswer": ["A", "B", "C", "D"],
      "correctAnswers": ["A", "B", "C", "D"],
      "isCorrect": true,
      "score": 10,
      "answerTime": 15
    },
    {
      "questionId": "question_003",
      "userAnswer": "质量和生产效率",
      "correctAnswers": ["质量", "生产效率"],
      "isCorrect": false,
      "score": 0,
      "answerTime": 5,
      "feedback": "答案不够准确，应该分别填写两个要素"
    },
    {
      "questionId": "question_004",
      "userAnswer": "C",
      "correctAnswer": "C",
      "isCorrect": true,
      "score": 5,
      "answerTime": 6
    },
    {
      "questionId": "question_005",
      "userAnswer": "软件工程是一门学科，强调系统的方法和过程管理，而程序设计更多关注代码实现的细节。软件工程处理大规模复杂系统，需要团队协作。",
      "referenceAnswer": "软件工程和程序设计的主要区别包括：\n1. 范围不同：软件工程涉及整个软件生命周期\n2. 方法论：软件工程强调系统的方法\n3. 规模不同：软件工程处理大规模复杂系统",
      "score": 15,
      "answerTime": 180,
      "graderComments": "理解较好，但表述可以更全面",
      "graderScore": 15,
      "gradedAt": "2024-09-05T14:00:00Z",
      "graderId": "teacher_001"
    }
  ],
  
  "metadata": {
    "createdAt": "2024-09-05T10:30:00Z",
    "updatedAt": "2024-09-05T14:00:00Z",
    "totalTimeSpent": 234,
    "device": "PC",
    "ipAddress": "192.168.1.100"
  }
}
```

---

## 示例3：学生学习进度追踪

```json
{
  "id": "student_progress_001",
  "studentId": "student_001",
  "courseId": "course_001",
  
  "chapterProgress": [
    {
      "chapterId": "chapter_001",
      "title": "第一章：软件工程基础",
      "status": "in_progress",
      "completionPercentage": 75,
      
      "sections": [
        {
          "sectionId": "section_001",
          "title": "软件工程概述",
          "status": "completed",
          "completionPercentage": 100,
          "videoProgress": 100,
          "exerciseCompleted": true,
          "exerciseScore": 35,
          "exerciseMaxScore": 40,
          "lastAccessedAt": "2024-09-05T10:30:00Z"
        },
        {
          "sectionId": "section_002",
          "title": "软件开发过程",
          "status": "in_progress",
          "completionPercentage": 50,
          "videoProgress": 75,
          "exerciseCompleted": false,
          "lastAccessedAt": "2024-09-06T14:20:00Z"
        }
      ]
    }
  ],
  
  "exerciseProgress": [
    {
      "exerciseId": "exercise_001",
      "chapterId": "chapter_001",
      "sectionId": "section_001",
      "title": "第一节课后练习",
      "status": "completed",
      "submissions": 1,
      "bestScore": 35,
      "maxScore": 40,
      "percentage": 87.5,
      "submittedAt": "2024-09-05T10:30:00Z",
      "gradedAt": "2024-09-05T14:00:00Z"
    },
    {
      "exerciseId": "exercise_002",
      "chapterId": "chapter_001",
      "sectionId": "section_002",
      "title": "第二节课后练习",
      "status": "not_started",
      "submissions": 0,
      "bestScore": 0,
      "maxScore": 40
    }
  ],
  
  "summary": {
    "totalChapters": 1,
    "completedChapters": 0,
    "inProgressChapters": 1,
    "totalExercises": 2,
    "completedExercises": 1,
    "totalExerciseScore": 35,
    "totalExerciseMaxScore": 80,
    "averageExerciseScore": 43.75,
    "totalStudyTime": 3600,
    "lastActivityAt": "2024-09-06T14:20:00Z"
  }
}
```

---

## 示例4：修改前后对比

### 修改前 - 章节仅作为学习模块

```json
{
  "id": "course_001",
  "chapters": [
    {
      "id": "chapter_001",
      "title": "第一章",
      "sections": [
        {
          "id": "section_001",
          "title": "第一节",
          "contentType": "video",
          "practice": {
            "practiceId": "practice_001",
            "questions": 5
          }
        }
      ]
    }
  ],
  "exercises": null
}
```

### 修改后 - 支持混合模式

```json
{
  "id": "course_001",
  "chapters": [
    {
      "id": "chapter_001",
      "title": "第一章",
      "homeworkMode": {
        "enabled": true,
        "type": "mixed",
        "releaseDate": "2024-09-01T00:00:00Z",
        "dueDate": "2024-09-07T23:59:59Z"
      },
      "sections": [
        {
          "id": "section_001",
          "title": "第一节",
          "contentType": "video",
          "sectionExercise": {
            "enabled": true,
            "exerciseId": "exercise_001",
            "displayMode": "inline"
          },
          "practice": {
            "practiceId": "practice_001",
            "questions": 5
          }
        }
      ]
    }
  ],
  "exercises": [
    {
      "id": "exercise_001",
      "chapterId": "chapter_001",
      "sectionId": "section_001",
      "type": "chapter_exercise",
      "questions": [...]
    }
  ]
}
```

---

## 示例5：API响应示例

### GET /api/courses/:courseId?include=exercises

```json
{
  "code": 200,
  "message": "成功",
  "data": {
    "id": "course_001",
    "type": "course",
    "basicInfo": {
      "title": "软件工程导论",
      "description": "..."
    },
    "chapters": [
      {
        "id": "chapter_001",
        "title": "第一章：软件工程基础",
        "homeworkMode": {
          "enabled": true,
          "type": "mixed"
        },
        "sections": [...]
      }
    ],
    "exercises": [
      {
        "id": "exercise_001",
        "type": "chapter_exercise",
        "title": "第一节课后练习",
        "questions": [...]
      }
    ]
  }
}
```

### POST /api/courses/:courseId/exercises/:exerciseId/submit

请求体：

```json
{
  "studentId": "student_001",
  "answers": [
    {
      "questionId": "question_001",
      "userAnswer": "A"
    },
    {
      "questionId": "question_002",
      "userAnswer": ["A", "B"]
    }
  ]
}
```

响应：

```json
{
  "code": 200,
  "message": "提交成功",
  "data": {
    "submissionId": "student_exercise_001",
    "status": "submitted",
    "receivedAt": "2024-09-05T10:30:00Z",
    "message": "你的答案已提交，等待自动评分..."
  }
}
```

---

## 示例6：TypeScript类型定义

```typescript
// 课程类型
interface Course {
  id: string;
  type: 'course';
  metadata: Metadata;
  basicInfo: BasicInfo;
  schedule: Schedule;
  chapters: Chapter[];
  exercises?: ChapterExercise[];
}

// 章节类型（支持混合模式）
interface Chapter {
  id: string;
  number: number;
  title: string;
  description: string;
  order: number;
  homeworkMode?: HomeworkModeConfig;
  sections: Section[];
}

// 混合模式配置
interface HomeworkModeConfig {
  enabled: boolean;
  type: 'none' | 'homework' | 'mixed';
  description?: string;
  releaseDate?: string;
  dueDate?: string;
  pointsMultiplier?: number;
  settings?: HomeworkSettings;
}

// 章节内容（支持内联练习）
interface Section {
  id: string;
  number: string;
  title: string;
  description: string;
  order: number;
  contentType: 'video' | 'document' | 'interactive';
  contentUrl: string;
  duration: number;
  sectionExercise?: SectionExerciseConfig;
  resources: Resources;
  practice?: Practice;
}

// 章节练习配置
interface SectionExerciseConfig {
  enabled: boolean;
  exerciseId: string;
  questions: number;
  optional: boolean;
  displayMode: 'inline' | 'modal' | 'redirect';
}

// 章节级别的练习
interface ChapterExercise {
  id: string;
  chapterId: string;
  sectionId?: string;
  title: string;
  description: string;
  type: 'chapter_exercise';
  difficulty: 'easy' | 'medium' | 'hard';
  displayMode: 'inline' | 'modal' | 'redirect' | 'mixed';
  metadata: Metadata;
  questions: Question[];
  statistics?: ExerciseStatistics;
}

// 学生提交记录
interface StudentExerciseSubmission {
  id: string;
  studentId: string;
  courseId: string;
  chapterId: string;
  sectionId?: string;
  exerciseId: string;
  type: 'chapter_exercise';
  submission: SubmissionInfo;
  answers: StudentAnswer[];
  metadata: SubmissionMetadata;
}

// 学生答案
interface StudentAnswer {
  questionId: string;
  userAnswer: string | string[];
  correctAnswer?: string | string[];
  isCorrect?: boolean;
  score: number;
  answerTime: number;
  feedback?: string;
}

// 提交信息
interface SubmissionInfo {
  submittedAt: string;
  status: 'submitted' | 'graded' | 'reviewed';
  totalScore: number;
  maxScore: number;
  percentage: number;
  passed: boolean;
  submittedCount: number;
}
```

---

## 迁移检查清单

- [ ] 修改Course JSON schema添加exercises数组
- [ ] 为Chapters添加homeworkMode配置字段
- [ ] 为Sections添加sectionExercise配置字段
- [ ] 创建ChapterExercise数据模型
- [ ] 创建StudentExerciseSubmission数据模型
- [ ] 数据库创建chapter_exercises表
- [ ] 数据库创建student_chapter_exercises表
- [ ] 后端API添加获取exercises端点
- [ ] 后端API添加提交章节练习端点
- [ ] 前端创建ExercisePanel组件
- [ ] Section页面集成ExercisePanel
- [ ] CourseHomework组件添加章节练习标签页
- [ ] 实现学生答题逻辑
- [ ] 实现自动评分逻辑
- [ ] 数据迁移脚本
- [ ] 集成测试
- [ ] 灰度发布

---

## 关键要点总结

1. **最小化改动** - 在现有结构上扩展，不破坏现有功能
2. **灵活配置** - 通过type和displayMode支持多种使用场景
3. **向后兼容** - 现有没有练习的章节可设置`homeworkMode.enabled = false`
4. **数据统一** - 所有练习数据存储在exercises数组中，按type区分
5. **UI灵活** - 支持inline、modal、redirect等多种展示模式
6. **学生体验** - 提供聚合的作业中心，展示所有练习进度
