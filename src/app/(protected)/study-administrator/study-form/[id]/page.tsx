import type { Metadata } from 'next';
import EditStudy from '@/components/study-administrator/EditStudy';

export const metadata = {
  title: 'Edit Study | Study Administrator',
} satisfies Metadata;


export default function Page(): React.JSX.Element {
  return <EditStudy />;
}
