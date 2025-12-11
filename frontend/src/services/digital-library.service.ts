import { api } from './api.client';
import type {
  Resource,
  LibraryStatistics,
  RecentlyAccessedResource,
  BookmarkResource,
  DownloadedResource,
  LibraryFilters,
} from '@/types/digital-library.types';

// Feature flag for mock data
const USE_MOCK_DATA = false;

// Mock resources data
const mockResources: Resource[] = [
  {
    id: 1,
    title: "Introduction to Algorithms",
    description: "A comprehensive guide to algorithms and data structures. Covers fundamental algorithms, analysis techniques, and design paradigms.",
    author: "Thomas H. Cormen",
    type: "book",
    category: "Textbooks",
    fileUrl: "/resources/algorithms.pdf",
    thumbnailUrl: "/thumbnails/algorithms.jpg",
    fileSize: "12.5 MB",
    pages: 1312,
    publishedDate: "2009-07-31",
    addedDate: "2024-11-01",
    views: 1245,
    downloads: 456,
  },
  {
    id: 2,
    title: "Machine Learning Fundamentals",
    description: "Learn the basics of machine learning, including supervised and unsupervised learning, neural networks, and deep learning.",
    author: "Dr. Sarah Johnson",
    type: "video",
    category: "Lecture Notes",
    fileUrl: "/resources/ml-fundamentals.mp4",
    thumbnailUrl: "/thumbnails/ml.jpg",
    fileSize: "850 MB",
    duration: "3h 45min",
    publishedDate: "2024-06-15",
    addedDate: "2024-11-15",
    views: 892,
    downloads: 234,
  },
  {
    id: 3,
    title: "Linear Algebra and Its Applications",
    description: "Essential linear algebra concepts with real-world applications in computer science, engineering, and data science.",
    author: "Gilbert Strang",
    type: "book",
    category: "Textbooks",
    fileUrl: "/resources/linear-algebra.pdf",
    thumbnailUrl: "/thumbnails/linear-algebra.jpg",
    fileSize: "8.3 MB",
    pages: 528,
    publishedDate: "2016-02-14",
    addedDate: "2024-10-20",
    views: 678,
    downloads: 345,
  },
  {
    id: 4,
    title: "Quantum Computing: A Gentle Introduction",
    description: "An accessible introduction to quantum computing principles, quantum gates, and quantum algorithms.",
    author: "Dr. Michael Chen",
    type: "paper",
    category: "Research Papers",
    fileUrl: "/resources/quantum-computing.pdf",
    fileSize: "2.1 MB",
    pages: 45,
    publishedDate: "2023-11-10",
    addedDate: "2024-11-20",
    views: 423,
    downloads: 178,
  },
  {
    id: 5,
    title: "Database Design and SQL",
    description: "Complete guide to relational database design, normalization, and SQL query optimization.",
    author: "Jennifer Martinez",
    type: "presentation",
    category: "Lecture Notes",
    fileUrl: "/resources/database-design.pptx",
    thumbnailUrl: "/thumbnails/database.jpg",
    fileSize: "5.7 MB",
    publishedDate: "2024-09-05",
    addedDate: "2024-11-10",
    views: 534,
    downloads: 267,
  },
  {
    id: 6,
    title: "Web Development Complete Course",
    description: "Full-stack web development course covering HTML, CSS, JavaScript, React, Node.js, and databases.",
    author: "Tech Academy",
    type: "video",
    category: "Lecture Notes",
    fileUrl: "/resources/web-dev-course.mp4",
    fileSize: "1.2 GB",
    duration: "8h 30min",
    publishedDate: "2024-08-20",
    addedDate: "2024-11-05",
    views: 1567,
    downloads: 623,
  },
  {
    id: 7,
    title: "Data Structures in C++",
    description: "Comprehensive guide to implementing data structures in C++, including arrays, linked lists, trees, and graphs.",
    author: "Robert Anderson",
    type: "book",
    category: "Textbooks",
    fileUrl: "/resources/data-structures-cpp.pdf",
    fileSize: "6.8 MB",
    pages: 456,
    publishedDate: "2022-05-12",
    addedDate: "2024-10-15",
    views: 789,
    downloads: 412,
  },
  {
    id: 8,
    title: "Introduction to Artificial Intelligence",
    description: "AI fundamentals covering search algorithms, knowledge representation, planning, and machine learning basics.",
    author: "Dr. Lisa Wong",
    type: "article",
    category: "Reference Materials",
    fileUrl: "/resources/intro-ai.pdf",
    fileSize: "1.5 MB",
    publishedDate: "2024-07-18",
    addedDate: "2024-11-12",
    views: 945,
    downloads: 389,
  },
  {
    id: 9,
    title: "Calculus: Early Transcendentals",
    description: "Comprehensive calculus textbook covering limits, derivatives, integrals, and series.",
    author: "James Stewart",
    type: "book",
    category: "Textbooks",
    fileUrl: "/resources/calculus.pdf",
    fileSize: "15.2 MB",
    pages: 1368,
    publishedDate: "2015-01-01",
    addedDate: "2024-10-01",
    views: 1123,
    downloads: 567,
  },
  {
    id: 10,
    title: "Python Programming Tutorial",
    description: "Learn Python from basics to advanced topics including OOP, file handling, and popular libraries.",
    author: "Code Masters",
    type: "video",
    category: "Lecture Notes",
    fileUrl: "/resources/python-tutorial.mp4",
    fileSize: "950 MB",
    duration: "5h 15min",
    publishedDate: "2024-10-10",
    addedDate: "2024-11-18",
    views: 1834,
    downloads: 712,
  },
];

// Mock bookmarked resources
let mockBookmarks: BookmarkResource[] = [
  {
    resourceId: 1,
    resource: mockResources[0],
    bookmarkedAt: "2024-11-25",
  },
  {
    resourceId: 6,
    resource: mockResources[5],
    bookmarkedAt: "2024-11-28",
  },
  {
    resourceId: 10,
    resource: mockResources[9],
    bookmarkedAt: "2024-12-01",
  },
];

// Mock downloaded resources
let mockDownloads: DownloadedResource[] = [
  {
    resourceId: 1,
    resource: mockResources[0],
    downloadedAt: "2024-11-20",
    localPath: "/downloads/algorithms.pdf",
  },
  {
    resourceId: 3,
    resource: mockResources[2],
    downloadedAt: "2024-11-22",
    localPath: "/downloads/linear-algebra.pdf",
  },
  {
    resourceId: 7,
    resource: mockResources[6],
    downloadedAt: "2024-11-27",
    localPath: "/downloads/data-structures-cpp.pdf",
  },
  {
    resourceId: 10,
    resource: mockResources[9],
    downloadedAt: "2024-12-02",
    localPath: "/downloads/python-tutorial.mp4",
  },
];

// Mock recently accessed resources
let mockRecentlyAccessed: RecentlyAccessedResource[] = [
  { ...mockResources[9], accessedAt: "2024-12-03T10:30:00" },
  { ...mockResources[5], accessedAt: "2024-12-02T15:45:00" },
  { ...mockResources[0], accessedAt: "2024-12-01T09:20:00" },
  { ...mockResources[2], accessedAt: "2024-11-30T14:10:00" },
  { ...mockResources[6], accessedAt: "2024-11-29T11:35:00" },
];

/**
 * Get library statistics
 */
export async function getLibraryStatistics(studentId: number): Promise<LibraryStatistics> {
  if (USE_MOCK_DATA) {
    await new Promise(resolve => setTimeout(resolve, 200));
    return {
      totalResources: mockResources.length,
      bookmarks: mockBookmarks.length,
      downloads: mockDownloads.length,
      recentlyAccessed: mockRecentlyAccessed.length,
    };
  }

  return api.get(`/digital-library/student/${studentId}/statistics`);
}

/**
 * Browse all resources with filters
 */
export async function browseResources(filters?: LibraryFilters): Promise<Resource[]> {
  if (USE_MOCK_DATA) {
    await new Promise(resolve => setTimeout(resolve, 300));

    let filtered = [...mockResources];

    // Apply search filter
    if (filters?.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        r =>
          r.title.toLowerCase().includes(searchLower) ||
          r.description.toLowerCase().includes(searchLower) ||
          r.author.toLowerCase().includes(searchLower)
      );
    }

    // Apply type filter
    if (filters?.type) {
      filtered = filtered.filter(r => r.type === filters.type);
    }

    // Apply category filter
    if (filters?.category) {
      filtered = filtered.filter(r => r.category === filters.category);
    }

    // Apply sorting
    if (filters?.sortBy) {
      filtered.sort((a, b) => {
        let comparison = 0;
        switch (filters.sortBy) {
          case "title":
            comparison = a.title.localeCompare(b.title);
            break;
          case "date":
            comparison = new Date(a.addedDate).getTime() - new Date(b.addedDate).getTime();
            break;
          case "views":
            comparison = a.views - b.views;
            break;
          case "downloads":
            comparison = a.downloads - b.downloads;
            break;
        }
        return filters.sortOrder === "desc" ? -comparison : comparison;
      });
    }

    return filtered;
  }

  const params = new URLSearchParams();
  if (filters?.search) params.append("search", filters.search);
  if (filters?.type) params.append("type", filters.type);
  if (filters?.category) params.append("category", filters.category);
  if (filters?.sortBy) params.append("sortBy", filters.sortBy);
  if (filters?.sortOrder) params.append("sortOrder", filters.sortOrder);

  return api.get(`/digital-library/student/resources?${params.toString()}`);
}

/**
 * Get bookmarked resources
 */
export async function getBookmarkedResources(studentId: number): Promise<BookmarkResource[]> {
  if (USE_MOCK_DATA) {
    await new Promise(resolve => setTimeout(resolve, 200));
    return [...mockBookmarks].reverse();
  }

  return api.get(`/digital-library/student/${studentId}/bookmarks`);
}

/**
 * Add bookmark
 */
export async function addBookmark(studentId: number, resourceId: number): Promise<void> {
  if (USE_MOCK_DATA) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const resource = mockResources.find(r => r.id === resourceId);
    if (resource && !mockBookmarks.some(b => b.resourceId === resourceId)) {
      mockBookmarks.push({
        resourceId,
        resource,
        bookmarkedAt: new Date().toISOString().split('T')[0],
      });
    }
    return;
  }

  return api.post(`/digital-library/student/${studentId}/bookmarks/${resourceId}`, {});
}

/**
 * Remove bookmark
 */
export async function removeBookmark(studentId: number, resourceId: number): Promise<void> {
  if (USE_MOCK_DATA) {
    await new Promise(resolve => setTimeout(resolve, 200));
    mockBookmarks = mockBookmarks.filter(b => b.resourceId !== resourceId);
    return;
  }

  return api.delete(`/digital-library/student/${studentId}/bookmarks/${resourceId}`);
}

/**
 * Get downloaded resources
 */
export async function getDownloadedResources(studentId: number): Promise<DownloadedResource[]> {
  if (USE_MOCK_DATA) {
    await new Promise(resolve => setTimeout(resolve, 200));
    return [...mockDownloads].reverse();
  }

  return api.get(`/digital-library/student/${studentId}/downloads`);
}

/**
 * Download resource
 */
export async function downloadResource(studentId: number, resourceId: number): Promise<void> {
  if (USE_MOCK_DATA) {
    await new Promise(resolve => setTimeout(resolve, 500));
    const resource = mockResources.find(r => r.id === resourceId);
    if (resource && !mockDownloads.some(d => d.resourceId === resourceId)) {
      mockDownloads.push({
        resourceId,
        resource,
        downloadedAt: new Date().toISOString().split('T')[0],
        localPath: `/downloads/${resource.title.toLowerCase().replace(/\s+/g, '-')}.${resource.type}`,
      });
      resource.downloads++;
    }
    return;
  }

  return api.post(`/digital-library/student/${studentId}/downloads/${resourceId}`, {});
}

/**
 * Get recently accessed resources
 */
export async function getRecentlyAccessedResources(studentId: number): Promise<RecentlyAccessedResource[]> {
  if (USE_MOCK_DATA) {
    await new Promise(resolve => setTimeout(resolve, 200));
    return [...mockRecentlyAccessed];
  }

  return api.get(`/digital-library/student/${studentId}/recent`);
}

/**
 * Mark resource as accessed
 */
export async function markResourceAccessed(studentId: number, resourceId: number): Promise<void> {
  if (USE_MOCK_DATA) {
    await new Promise(resolve => setTimeout(resolve, 100));
    const resource = mockResources.find(r => r.id === resourceId);
    if (resource) {
      // Remove if already in recent
      mockRecentlyAccessed = mockRecentlyAccessed.filter(r => r.id !== resourceId);
      // Add to front
      mockRecentlyAccessed.unshift({
        ...resource,
        accessedAt: new Date().toISOString(),
      });
      // Keep only last 10
      mockRecentlyAccessed = mockRecentlyAccessed.slice(0, 10);
      resource.views++;
    }
    return;
  }

  return api.post(`/digital-library/student/${studentId}/access/${resourceId}`, {});
}
