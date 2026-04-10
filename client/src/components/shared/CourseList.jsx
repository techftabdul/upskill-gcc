import { Clock, BookOpen, Star } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import './CourseList.css';

const courses = [
  {
    id: 1,
    title: 'Business Arabic for Beginners',
    description: 'Learn standard greetings, email etiquette, and meeting vocabulary to navigate GCC offices confidently.',
    duration: '4 Weeks',
    level: 'Beginner',
    rating: 4.8,
    students: 1250,
    image: 'bg-blue-gradient'
  },
  {
    id: 2,
    title: 'Navigating UAE Labor Law',
    description: 'Essential knowledge of employee rights, contracts, and regulations for expats working in Dubai and Abu Dhabi.',
    duration: '2 Weeks',
    level: 'All Levels',
    rating: 4.9,
    students: 840,
    image: 'bg-orange-gradient'
  },
  {
    id: 3,
    title: 'Digital Marketing in MENA',
    description: 'Master regional platforms, localization strategies, and consumer behavior in the Middle East.',
    duration: '6 Weeks',
    level: 'Intermediate',
    rating: 4.7,
    students: 2100,
    image: 'bg-green-gradient'
  }
];

const CourseList = () => {
  return (
    <div className="course-list">
      {courses.map(course => (
        <Card key={course.id} className="course-card" hoverEffect>
          <div className={`course-image-placeholder ${course.image}`}></div>
          <div className="course-content">
            <div className="course-badges">
              <span className="badge">{course.level}</span>
              <span className="badge-rating"><Star size={14} className="star-icon" /> {course.rating}</span>
            </div>
            <h3 className="course-title">{course.title}</h3>
            <p className="course-description">{course.description}</p>
            
            <div className="course-meta">
              <span className="meta-item"><Clock size={16} /> {course.duration}</span>
              <span className="meta-item"><BookOpen size={16} /> {course.students} enrolled</span>
            </div>
            
            <Button variant="outline" className="course-action">View Course</Button>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default CourseList;
