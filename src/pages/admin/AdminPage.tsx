
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PageHeader from "@/components/ui/PageHeader";
import AddConcertReview from "./AddConcertReview";
import AddFestivalReview from "./AddFestivalReview";
import AddNewsItem from "./AddNewsItem";
import ManageFeaturedEvents from "./ManageFeaturedEvents";
import AddEvent from "./AddEvent";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const AdminPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // Check if user is admin or contributor
    if (!user) {
      setIsAuthorized(false);
    } else {
      setIsAuthorized(user.isAdmin || user.isContributor);
    }
  }, [user]);

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[50vh]">
          <div className="bg-dark-300 p-6 rounded-lg shadow-md max-w-md w-full text-center">
            <h2 className="text-xl font-bold text-white mb-4">Admin Access Required</h2>
            <p className="text-gray-400 mb-6">You need to be logged in as an administrator to view this page.</p>
            <Button onClick={() => navigate('/login')}>
              Go to Login
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[50vh]">
          <div className="bg-dark-300 p-6 rounded-lg shadow-md max-w-md w-full text-center">
            <h2 className="text-xl font-bold text-white mb-4">Unauthorized Access</h2>
            <p className="text-gray-400 mb-6">You do not have permission to access the admin dashboard.</p>
            <Button onClick={() => navigate('/')}>
              Go to Home Page
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title="Admin Dashboard"
        subtitle="Manage content for Dirty Boots"
      />
      
      <div className="mt-8">
        <Tabs defaultValue="add-event">
          <TabsList className="bg-dark-400 mb-8">
            {/* Contributors can only add events */}
            <TabsTrigger value="add-event">Add Event</TabsTrigger>
            
            {/* Admin only features */}
            {user.isAdmin && (
              <>
                <TabsTrigger value="concert-reviews">Concert Reviews</TabsTrigger>
                <TabsTrigger value="festival-reviews">Festival Reviews</TabsTrigger>
                <TabsTrigger value="news">News</TabsTrigger>
                <TabsTrigger value="featured">Featured Events</TabsTrigger>
              </>
            )}
          </TabsList>
          
          {/* Event adding is available to both admins and contributors */}
          <TabsContent value="add-event">
            <AddEvent />
          </TabsContent>
          
          {/* Admin only content */}
          {user.isAdmin && (
            <>
              <TabsContent value="concert-reviews">
                <AddConcertReview />
              </TabsContent>
              
              <TabsContent value="festival-reviews">
                <AddFestivalReview />
              </TabsContent>
              
              <TabsContent value="news">
                <AddNewsItem />
              </TabsContent>
              
              <TabsContent value="featured">
                <ManageFeaturedEvents />
              </TabsContent>
            </>
          )}
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPage;
