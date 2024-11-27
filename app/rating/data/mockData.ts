import { Clip, Step, TimelineRow } from '../components/types';

export const mockClips: Clip[] = [
  { id: 1, title: 'Clip 1', thumbnail: '/placeholder.svg?height=80&width=80', rated: false, inProgress: false },
  { id: 2, title: 'Clip 2', thumbnail: '/placeholder.svg?height=80&width=80', rated: false, inProgress: true },
  { id: 3, title: 'Clip 3', thumbnail: '/placeholder.svg?height=80&width=80', rated: true, inProgress: false },
  { id: 4, title: 'Clip 4', thumbnail: '/placeholder.svg?height=80&width=80', rated: false, inProgress: false },
  { id: 5, title: 'Clip 5', thumbnail: '/placeholder.svg?height=80&width=80', rated: true, inProgress: false }
];

export const mockStepTypes: Step[] = [
  {
    id: '1',
    name: 'Initial Position',
    ratings: [
      { id: '1', name: 'Posture', scaleStart: 1, scaleEnd: 5 },
      { id: '2', name: 'Balance', scaleStart: 1, scaleEnd: 10 },
    ],
    totalClips: 15,
    ratedClips: 7,
  },
  {
    id: '2',
    name: 'Movement Execution',
    ratings: [
      { id: '3', name: 'Speed', scaleStart: 1, scaleEnd: 5 },
      { id: '4', name: 'Precision', scaleStart: 1, scaleEnd: 10 },
    ],
    totalClips: 20,
    ratedClips: 20,
  }
];

export const initialTimelineRows: TimelineRow[] = [
  { id: 'video', label: 'V', type: 'video' },
  { id: 'audio', label: 'A', type: 'audio' },
  { id: 'sensor1', label: '1', type: 'sensor' },
];

export const allChannels: string[] = Array.from({ length: 126 }, (_, i) => `Channel ${i + 1}`); 