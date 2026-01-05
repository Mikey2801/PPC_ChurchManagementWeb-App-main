// Import images at the top of the file
import BibleStudyImg from '../assets/OurProgram/Bible study.jpg';
import KidsOutreachImg from '../assets/OurProgram/Kids Outreach.jpg';
import SundayServiceImg from '../assets/OurProgram/Sunday service.jpg';
import SmallGroupImg from '../assets/OurProgram/Small group.jpg';
import YouthJamImg from '../assets/OurProgram/Youth jam.jpg';
import AcousticNightImg from '../assets/OurProgram/Acoustic evangelistc night.webp';
import ChurchAnniversaryImg from '../assets/OurProgram/Church anniversary.webp';
import DvbsImg from '../assets/OurProgram/DVBS.jpg';

const programs = [
  {
    id: 'bible-study',
    title: 'Bible Study',
    schedule: 'EVERY FRIDAY & SATURDAY',
    time: '6:00 PM',
    description: 'Join us for in-depth Bible study and discussion to grow in faith and understanding of God\'s Word.',
    image: BibleStudyImg
  },
  {
    id: 'kids-outreach',
    title: 'Kids Outreach',
    schedule: 'EVERY SUNDAY',
    time: '2:00 PM',
    description: 'Special ministry focused on teaching children about Jesus through fun activities, songs, and Bible stories.',
    image: KidsOutreachImg
  },
  {
    id: 'sunday-service',
    title: 'Sunday Service',
    schedule: 'EVERY SUNDAY',
    time: '9:00 AM',
    description: 'Join us for our weekly worship service with inspiring messages, prayer, and fellowship.',
    image: SundayServiceImg
  },
  {
    id: 'small-group',
    title: 'Small Group',
    schedule: 'EVERY SUNDAY',
    time: '11:00 AM',
    description: 'Intimate gatherings for prayer, Bible study, and building meaningful relationships within our church community.',
    image: SmallGroupImg
  },
  {
    id: 'youth-jam',
    title: 'Youth Jam',
    schedule: 'ONCE A MONTH',
    time: '5:00 PM',
    description: 'A dynamic monthly event for youth with worship, relevant teaching, and fun activities.',
    image: YouthJamImg
  },
  {
    id: 'acoustic-night',
    title: 'Acoustic Evangelistic Night',
    schedule: 'ONCE A YEAR',
    time: '7:00 PM',
    description: 'An annual evening of worship, testimony, and evangelism through music and personal stories.',
    image: AcousticNightImg
  },
  {
    id: 'church-anniversary',
    title: 'Church Anniversary',
    schedule: 'ONCE A YEAR',
    time: 'All Day',
    description: 'Celebrating God\'s faithfulness throughout the years with special services, food, and fellowship.',
    image: ChurchAnniversaryImg
  },
  {
    id: 'dvbs',
    title: 'DVBS (Daily Vacation Bible School)',
    schedule: 'ONCE A YEAR',
    time: '9:00 AM - 12:00 PM',
    description: 'An exciting week-long program for children to learn about Jesus through Bible stories, games, and crafts.',
    image: DvbsImg
  }
];

export default programs;
