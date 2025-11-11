"use client";
import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, MapPin, Users, Star, Crown, ArrowRight, Sparkles } from 'lucide-react';
import { eventService, Event } from '@/lib/database';
import { Query } from 'appwrite';

export default function FeaturedSection() {
     const [featuredEvents, setFeaturedEvents] = useState<Event[]>([]);
     const [loading, setLoading] = useState(true);
     const router = useRouter();
     const sectionRef = useRef<HTMLDivElement>(null);

     useEffect(() => {
          fetchFeaturedEvents();
     }, []);

     const fetchFeaturedEvents = async () => {
          try {
               setLoading(true);
               const events = await eventService.getAllEvents([
                    Query.equal('isFeatured', true),
                    Query.equal('status', 'upcoming'),
                    Query.orderAsc('date'),
                    Query.limit(6)
               ]);
               setFeaturedEvents(events);
          } catch (error) {
               console.error('Error fetching featured events:', error);
          } finally {
               setLoading(false);
          }
     };

     const formatDate = (dateString: string) => {
          return new Date(dateString).toLocaleDateString('en-US', {
               month: 'short',
               day: 'numeric',
               year: 'numeric'
          });
     };

     const handleCardClick = (eventId: string) => {
          router.push(`/events/${eventId}`);
     };

     if (loading) {
          return (
               <section className="py-12 sm:py-16 md:py-20 relative overflow-hidden bg-gradient-to-b from-purple-50/50 via-white to-pink-50/50 dark:from-purple-950/10 dark:via-transparent dark:to-pink-950/10">
                    <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
                         <div className="text-center space-y-3 sm:space-y-4">
                              <div className="inline-block animate-spin rounded-full h-12 sm:h-14 md:h-16 w-12 sm:w-14 md:w-16 border-3 sm:border-4 border-purple-500 border-t-transparent"></div>
                              <p className="text-sm sm:text-base md:text-lg font-medium text-gray-600 dark:text-gray-400">Loading featured events...</p>
                         </div>
                    </div>
               </section>
          );
     }

     if (featuredEvents.length === 0) {
          return null;
     }

     return (
          <section ref={sectionRef} className="py-12 sm:py-16 md:py-20 relative overflow-hidden">
               {/* Decorative Elements */}
               <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-8 sm:top-12 md:top-20 left-4 sm:left-6 md:left-10 w-48 sm:w-60 md:w-72 h-48 sm:h-60 md:h-72 bg-purple-300/20 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute bottom-8 sm:bottom-12 md:bottom-20 right-4 sm:right-6 md:right-10 w-64 sm:w-80 md:w-96 h-64 sm:h-80 md:h-96 bg-pink-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
               </div>

               <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 relative z-10">
                    {/* Header */}
                    <div className="text-center mb-10 sm:mb-12 md:mb-16 space-y-3 sm:space-y-4 md:space-y-5">
                         <div className="inline-flex items-center gap-2 px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-full bg-white/80 dark:bg-black/40 backdrop-blur-lg border border-purple-200 dark:border-purple-800 shadow-lg">
                              <Sparkles className="w-4 sm:w-4.5 md:w-5 h-4 sm:h-4.5 md:h-5 text-purple-600" />
                              <span className="font-semibold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent text-xs sm:text-sm md:text-base">
                                   Featured Events
                              </span>
                         </div>

                         <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black">
                              <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">
                                   Don't Miss Out
                              </span>
                         </h2>
                         
                         <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
                              Join our most anticipated events and be part of something extraordinary
                         </p>
                    </div>

                    {/* Events Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
                         {featuredEvents.map((event, index) => (
                              <div
                                   key={event.$id}
                                   onClick={() => handleCardClick(event.$id!)}
                                   className="group cursor-pointer"
                                   style={{ 
                                        animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both` 
                                   }}
                              >
                                   <div className="relative bg-white dark:bg-gray-900 rounded-2xl sm:rounded-2xl md:rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-purple-100 dark:border-purple-900/30">
                                        {/* Image Section */}
                                        <div className="relative h-40 sm:h-48 md:h-56 lg:h-64 overflow-hidden">
                                             <img
                                                  src={event.image}
                                                  alt={event.title}
                                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                             />
                                             
                                             {/* Gradient Overlay */}
                                             <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                                             {/* Badges */}
                                             <div className="absolute top-2 sm:top-3 md:top-4 left-2 sm:left-3 md:left-4 flex flex-col gap-1.5 sm:gap-2">
                                                  {event.isFeatured && (
                                                       <div className="flex items-center gap-1 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-yellow-500 text-white text-xs font-bold shadow-lg">
                                                            <Star className="w-2.5 sm:w-3 md:w-3.5 h-2.5 sm:h-3 md:h-3.5" />
                                                            Featured
                                                       </div>
                                                  )}
                                                  {event.isPremium && (
                                                       <div className="flex items-center gap-1 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-purple-600 text-white text-xs font-bold shadow-lg">
                                                            <Crown className="w-2.5 sm:w-3 md:w-3.5 h-2.5 sm:h-3 md:h-3.5" />
                                                            Premium
                                                       </div>
                                                  )}
                                             </div>

                                             {/* Category */}
                                             <div className="absolute top-2 sm:top-3 md:top-4 right-2 sm:right-3 md:right-4">
                                                  <span className="px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-semibold border border-white/30">
                                                       {event.category}
                                                  </span>
                                             </div>

                                             {/* Date Badge */}
                                             <div className="absolute bottom-2 sm:bottom-3 md:bottom-4 left-2 sm:left-3 md:left-4">
                                                  <div className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-white/95 dark:bg-black/95 backdrop-blur-md shadow-lg">
                                                       <Calendar className="w-3 sm:w-3.5 md:w-4 h-3 sm:h-3.5 md:h-4 text-purple-600" />
                                                       <span className="font-bold text-xs sm:text-sm">{formatDate(event.date)}</span>
                                                  </div>
                                             </div>
                                        </div>

                                        {/* Content Section */}
                                        <div className="p-3 sm:p-4 md:p-5 lg:p-6 space-y-2 sm:space-y-3 md:space-y-4">
                                             {/* Title */}
                                             <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-black text-gray-900 dark:text-white line-clamp-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                                                  {event.title}
                                             </h3>

                                             {/* Description */}
                                             <p className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">
                                                  {event.description}
                                             </p>

                                             {/* Details */}
                                             <div className="space-y-2 sm:space-y-2.5 md:space-y-3 pt-1 sm:pt-2">
                                                  <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                                                       <div className="w-6 sm:w-7 md:w-8 h-6 sm:h-7 md:h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
                                                            <MapPin className="w-3 sm:w-3.5 md:w-4 h-3 sm:h-3.5 md:h-4 text-purple-600" />
                                                       </div>
                                                       <span className="font-medium truncate">{event.location}</span>
                                                  </div>

                                                  <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                                                       <div className="w-6 sm:w-7 md:w-8 h-6 sm:h-7 md:h-8 rounded-full bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center flex-shrink-0">
                                                            <Users className="w-3 sm:w-3.5 md:w-4 h-3 sm:h-3.5 md:h-4 text-pink-600" />
                                                       </div>
                                                       <span className="font-medium">{event.registered} registered</span>
                                                       {event.capacity && (
                                                            <span className="text-xs text-gray-500 whitespace-nowrap">
                                                                 • {event.capacity - event.registered} left
                                                            </span>
                                                       )}
                                                  </div>
                                             </div>

                                             {/* Tags */}
                                             <div className="flex flex-wrap gap-1.5 sm:gap-2 pt-1 sm:pt-2">
                                                  {event.tags.slice(0, 2).map((tag, idx) => (
                                                       <span
                                                            key={idx}
                                                            className="px-2.5 sm:px-3 py-0.5 sm:py-1 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 text-purple-700 dark:text-purple-300 text-xs rounded-full font-medium"
                                                       >
                                                            {tag}
                                                       </span>
                                                  ))}
                                             </div>

                                             {/* Price & CTA */}
                                             <div className="flex items-center justify-between pt-3 sm:pt-3.5 md:pt-4 border-t border-gray-200 dark:border-gray-800">
                                                  <div>
                                                       {event.discountPrice && event.discountPrice < event.price ? (
                                                            <div className="flex items-center gap-1.5 sm:gap-2">
                                                                 <span className="text-lg sm:text-xl md:text-2xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                                                      ${event.discountPrice}
                                                                 </span>
                                                                 <span className="text-xs sm:text-sm text-gray-400 line-through">
                                                                      ${event.price}
                                                                 </span>
                                                            </div>
                                                       ) : event.price === 0 ? (
                                                            <span className="text-lg sm:text-xl md:text-2xl font-black text-green-600">Free</span>
                                                       ) : (
                                                            <span className="text-lg sm:text-xl md:text-2xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                                                 ${event.price}
                                                            </span>
                                                       )}
                                                  </div>

                                                  <div className="flex items-center gap-1.5 sm:gap-2 text-purple-600 dark:text-purple-400 font-semibold group-hover:gap-3 transition-all">
                                                       <span className="text-xs sm:text-sm">View</span>
                                                       <ArrowRight className="w-3 sm:w-3.5 md:w-4 h-3 sm:h-3.5 md:h-4" />
                                                  </div>
                                             </div>
                                        </div>
                                   </div>
                              </div>
                         ))}
                    </div>

                    {/* View All Button */}
                    <div className="text-center mt-10 sm:mt-12 md:mt-16">
                         <button
                              onClick={() => router.push('/events')}
                              className="group inline-flex items-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-sm sm:text-base md:text-lg rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95"
                         >
                              <span>Explore All Events</span>
                              <ArrowRight className="w-4 sm:w-4.5 md:w-5 h-4 sm:h-4.5 md:h-5 group-hover:translate-x-1 transition-transform" />
                         </button>
                    </div>
               </div>

               <style jsx>{`
                    @keyframes fadeInUp {
                         from {
                              opacity: 0;
                              transform: translateY(30px);
                         }
                         to {
                              opacity: 1;
                              transform: translateY(0);
                         }
                    }
               `}</style>
          </section>
     );
}