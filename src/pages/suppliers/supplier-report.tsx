
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SupplierReportRedirect() {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to the view suppliers page
    navigate('/suppliers/view');
  }, [navigate]);
  
  return (
    <div className="flex items-center justify-center h-screen">
      <p>Redirecting to suppliers view...</p>
    </div>
  );
}
