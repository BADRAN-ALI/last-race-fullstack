import { Spinner } from 'react-bootstrap';


export default function LoadingSpinner({ full = false, label = 'Loading…' }) {
  const content = (
    <div className="text-center lr-subtle">
      <Spinner animation="border" role="status" aria-hidden="true" />
      <div className="mt-2">{label}</div>
    </div>
  );
  return (
    <div
      className={`d-flex align-items-center justify-content-center ${full ? 'lr-fullpage' : 'py-5'}`}
    >
      {content}
    </div>
  );
}
