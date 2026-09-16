export interface CourseInterface {
  _id: string;
  title: string;
  instructor: string;
  description: string;
  price: number;
  duration: string;
  category: 'frontend' | 'backend' | 'database' | 'programming' | 'devops' | 'mobile';
  level: 'beginner' | 'intermediate' | 'advanced';
  rating?: number;
  students?: number;
  imageUrl?: string
}
