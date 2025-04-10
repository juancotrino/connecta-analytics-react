import type { Metadata } from 'next';
import StudyForm from '@/components/study-administrator/StudyForm';

export const metadata = {
  title: 'New Study | Study Administrator',
} satisfies Metadata;


export default function Page(): React.JSX.Element {
  return <StudyForm />;
}
