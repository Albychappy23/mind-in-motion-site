import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";

interface HeaderProps {
  onAdminClick: () => void;
}

export default function Header({ onAdminClick }: HeaderProps) {
  return (
    <header className="bg-primary text-white shadow-lg">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Mind in Motion</h1>
            <p className="text-blue-200 text-lg">Supporting Athletes Mentally After Injury</p>
          </div>
          <div className="flex justify-center md:justify-end space-x-4">
            <Button 
              onClick={onAdminClick}
              variant="secondary"
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Settings className="w-4 h-4 mr-2" />
              Admin
            </Button>
            <Button variant="outline" className="bg-white text-primary hover:bg-gray-100 border-white">
              Get Help Now
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
