/**
 * Mock data for curriculum management
 * Used for frontend development before backend integration
 */

import {
  Course,
  Subject,
  Topic,
  Subtopic,
  CourseWithCounts,
  SubjectWithCounts,
  TopicWithSubtopics,
} from '@/types/curriculum.types';

// Mock Courses
export const mockCourses: CourseWithCounts[] = [
  {
    id: 1,
    name: 'Computer Science Engineering',
    code: 'CSE',
    description: 'Core computer science and engineering subjects',
    iconUrl: '💻',
    isActive: true,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-12-01'),
    subjectCount: 8,
    topicCount: 85,
  },
  {
    id: 2,
    name: 'Mechanical Engineering',
    code: 'MECH',
    description: 'Mechanical engineering core and elective subjects',
    iconUrl: '⚙️',
    isActive: true,
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-11-28'),
    subjectCount: 6,
    topicCount: 62,
  },
  {
    id: 3,
    name: 'Business Administration',
    code: 'BBA',
    description: 'Business and management subjects',
    iconUrl: '💼',
    isActive: true,
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-12-05'),
    subjectCount: 7,
    topicCount: 58,
  },
];

// Mock Subjects
export const mockSubjects: SubjectWithCounts[] = [
  // CSE Subjects
  {
    id: 1,
    courseId: 1,
    name: 'Data Structures',
    code: 'CS101',
    credits: 4,
    description: 'Fundamental data structures and algorithms',
    orderIndex: 1,
    isActive: true,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-12-01'),
    topicCount: 12,
    subtopicCount: 36,
  },
  {
    id: 2,
    courseId: 1,
    name: 'Database Management Systems',
    code: 'CS201',
    credits: 3,
    description: 'Relational databases, SQL, and database design',
    orderIndex: 2,
    isActive: true,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-11-28'),
    topicCount: 10,
    subtopicCount: 28,
  },
  {
    id: 3,
    courseId: 1,
    name: 'Operating Systems',
    code: 'CS301',
    credits: 4,
    description: 'OS concepts, process management, memory management',
    orderIndex: 3,
    isActive: true,
    createdAt: new Date('2024-01-16'),
    updatedAt: new Date('2024-12-02'),
    topicCount: 8,
    subtopicCount: 24,
  },
  // BBA Subjects
  {
    id: 4,
    courseId: 3,
    name: 'Marketing Management',
    code: 'BBA101',
    credits: 3,
    description: 'Principles and practices of marketing',
    orderIndex: 1,
    isActive: true,
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-12-05'),
    topicCount: 9,
    subtopicCount: 27,
  },
];

// Mock Topics
export const mockTopics: TopicWithSubtopics[] = [
  // Data Structures Topics
  {
    id: 1,
    subjectId: 1,
    name: 'Arrays',
    description: 'Introduction to arrays and array operations',
    orderIndex: 1,
    isActive: true,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-12-01'),
    subtopics: [
      {
        id: 1,
        topicId: 1,
        name: 'Dynamic Arrays',
        content: `<h2>Dynamic Arrays</h2>
<p>Dynamic arrays are arrays that can grow or shrink in size at runtime. Unlike static arrays, they provide flexibility in memory allocation.</p>
<h3>Key Concepts:</h3>
<ul>
  <li>Automatic resizing when capacity is reached</li>
  <li>Amortized O(1) append operation</li>
  <li>Doubling strategy for capacity expansion</li>
</ul>
<pre><code class="language-python">
# Example of dynamic array (Python list)
arr = []
arr.append(1)  # O(1) amortized
arr.append(2)
print(arr)  # [1, 2]
</code></pre>`,
        examples: 'Array doubling example, insertion at end vs middle',
        durationMinutes: 30,
        difficultyLevel: 'medium',
        learningObjectives: 'Understand resizing strategy, analyze time complexity',
        orderIndex: 1,
        isActive: true,
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-12-01'),
      },
      {
        id: 2,
        topicId: 1,
        name: 'Multi-dimensional Arrays',
        content: `<h2>Multi-dimensional Arrays</h2>
<p>Arrays with more than one dimension, commonly used for matrices and grids.</p>`,
        examples: 'Matrix operations, 2D grid traversal',
        durationMinutes: 45,
        difficultyLevel: 'hard',
        learningObjectives: 'Work with 2D and 3D arrays, understand memory layout',
        orderIndex: 2,
        isActive: true,
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-12-01'),
      },
      {
        id: 3,
        topicId: 1,
        name: 'Array Operations',
        content: `<h2>Array Operations</h2>
<p>Common operations performed on arrays.</p>`,
        examples: 'Insertion, deletion, search, sort',
        durationMinutes: 25,
        difficultyLevel: 'easy',
        learningObjectives: 'Master basic array manipulations',
        orderIndex: 3,
        isActive: true,
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-12-01'),
      },
    ],
    _count: { subtopics: 3 },
  },
  {
    id: 2,
    subjectId: 1,
    name: 'Linked Lists',
    description: 'Linear data structures with nodes and pointers',
    orderIndex: 2,
    isActive: true,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-12-01'),
    subtopics: [
      {
        id: 4,
        topicId: 2,
        name: 'Singly Linked Lists',
        content: '<h2>Singly Linked Lists</h2><p>A linear collection of nodes where each node points to the next node.</p>',
        examples: 'Implementation, insertion, deletion',
        durationMinutes: 40,
        difficultyLevel: 'medium',
        learningObjectives: 'Implement and manipulate singly linked lists',
        orderIndex: 1,
        isActive: true,
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-12-01'),
      },
      {
        id: 5,
        topicId: 2,
        name: 'Doubly Linked Lists',
        content: '<h2>Doubly Linked Lists</h2><p>Nodes have pointers to both next and previous nodes.</p>',
        examples: 'Bidirectional traversal, efficient deletion',
        durationMinutes: 45,
        difficultyLevel: 'medium',
        learningObjectives: 'Understand advantages over singly linked lists',
        orderIndex: 2,
        isActive: true,
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-12-01'),
      },
    ],
    _count: { subtopics: 2 },
  },
  {
    id: 3,
    subjectId: 1,
    name: 'Stacks',
    description: 'LIFO (Last In First Out) data structure',
    orderIndex: 3,
    isActive: true,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-12-01'),
    subtopics: [
      {
        id: 6,
        topicId: 3,
        name: 'Stack Implementation',
        content: '<h2>Stack Implementation</h2><p>Implementing stacks using arrays and linked lists.</p>',
        examples: 'Array-based stack, linked list-based stack',
        durationMinutes: 30,
        difficultyLevel: 'easy',
        learningObjectives: 'Implement stack operations: push, pop, peek',
        orderIndex: 1,
        isActive: true,
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-12-01'),
      },
    ],
    _count: { subtopics: 1 },
  },
];

// Helper functions to get filtered data
export const getCourseById = (id: number): CourseWithCounts | undefined => {
  return mockCourses.find((course) => course.id === id);
};

export const getSubjectsByCourseId = (courseId: number): SubjectWithCounts[] => {
  return mockSubjects.filter((subject) => subject.courseId === courseId);
};

export const getSubjectById = (id: number): SubjectWithCounts | undefined => {
  return mockSubjects.find((subject) => subject.id === id);
};

export const getTopicsBySubjectId = (subjectId: number): TopicWithSubtopics[] => {
  return mockTopics.filter((topic) => topic.subjectId === subjectId);
};

export const getTopicById = (id: number): TopicWithSubtopics | undefined => {
  return mockTopics.find((topic) => topic.id === id);
};
