
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function Unauthorized() {
  const navigate = useNavigate();

  return (
    <div className="container flex flex-col items-center justify-center min-h-screen py-6">
      <h1 className="text-4xl font-bold mb-4">Unauthorized Access</h1>
      <p className="text-muted-foreground mb-6">
        You don't have permission to access this page.
      </p>
      <Button onClick={() => navigate("/")}>Return to Home</Button>
    </div>
  );
}
