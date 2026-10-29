import { PolicyPage, policyMetadata } from '@/components/pages/PolicyPage';
export const metadata = policyMetadata('en', 'cookies');
export default function Page() { return <PolicyPage locale="en" slug="cookies" />; }
