
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PageHeader from "@/components/ui/PageHeader";
import AddConcertReview from "./AddConcertReview";
import AddFestivalReview from "./AddFestivalReview";
import AddNewsItem from "./AddNewsItem";
import ManageFeaturedEvents from "./ManageFeaturedEvents";

const AdminPage = () => {
  const [isLoggedIn] = useState(true); // In a real app, this would be managed by auth state

  if (!isLoggedIn) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[50vh]">
          <div className="bg-dark-300 p-6 rounded-lg shadow-md max-w-md w-full text-center">
            <h2 className="text-xl font-bold text-white mb-4">Admin Access Required</h2>
            <p className="text-gray-400 mb-6">You need to be logged in as an administrator to view this page.</p>
            <Button>
              Go to Login
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
        <Tabs defaultValue="concert-reviews">
          <TabsList className="bg-dark-400 mb-8">
            <TabsTrigger value="concert-reviews">Concert Reviews</TabsTrigger>
            <TabsTrigger value="festival-reviews">Festival Reviews</TabsTrigger>
            <TabsTrigger value="news">News</TabsTrigger>
            <TabsTrigger value="featured">Featured Events</TabsTrigger>
          </TabsList>
          
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
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPage;
