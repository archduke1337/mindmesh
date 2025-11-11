import { Card, CardBody } from "@heroui/card";
import { Avatar, AvatarGroup } from "@heroui/avatar";
import { Chip } from "@heroui/chip";
import { title, subtitle } from "@/components/primitives";

export default function AboutPage() {
  const stats = [
    { label: "Active Members", value: "500+", color: "primary" },
    { label: "Events Hosted", value: "50+", color: "secondary" },
    { label: "Projects Built", value: "100+", color: "success" },
    { label: "Years Running", value: "3+", color: "warning" },
  ];

  const values = [
    {
      icon: "💡",
      title: "Innovation",
      description: "We foster creativity and encourage thinking outside the box",
    },
    {
      icon: "🤝",
      title: "Collaboration",
      description: "Building connections and working together to achieve more",
    },
    {
      icon: "🚀",
      title: "Growth",
      description: "Continuous learning and development for all members",
    },
    {
      icon: "🌟",
      title: "Excellence",
      description: "Striving for quality in everything we create",
    },
  ];

  const teamMembers = [
    "https://i.pravatar.cc/150?u=a042581f4e29026024d",
    "https://i.pravatar.cc/150?u=a04258a2462d826712d",
    "https://i.pravatar.cc/150?u=a042581f4e29026704d",
    "https://i.pravatar.cc/150?u=a04258114e29026302d",
    "https://i.pravatar.cc/150?u=a04258114e29026708c",
  ];

  return (
    <div className="space-y-8 sm:space-y-10 md:space-y-12 lg:space-y-16 pb-10 sm:pb-12 md:pb-16 lg:pb-20 px-3 sm:px-4 md:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="text-center space-y-3 sm:space-y-4 md:space-y-5 lg:space-y-6 relative py-6 sm:py-8 md:py-10">
        <div className="absolute top-0 left-1/4 w-48 sm:w-60 md:w-72 h-48 sm:h-60 md:h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-8 sm:top-12 md:top-16 lg:top-20 right-1/4 w-64 sm:w-80 md:w-96 h-64 sm:h-80 md:h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-700" />
        
        <div className="relative z-10 max-w-7xl mx-auto">
          <h1 className={title({ size: "lg" })}>
            About{" "}
            <span className={title({ color: "violet", size: "lg" })}>
              Mind Mesh
            </span>
          </h1>
          <p className={subtitle({ class: "mt-3 sm:mt-4 md:mt-5 lg:mt-6 max-w-2xl mx-auto text-xs sm:text-sm md:text-base lg:text-lg" })}>
            A community where ideas connect, creativity flourishes, and innovation thrives
          </p>
        </div>
      </div>


      {/* Story Section */}
      <Card className="border-none bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 max-w-7xl mx-auto w-full" shadow="lg">
        <CardBody className="p-4 sm:p-6 md:p-8 lg:p-12 space-y-3 sm:space-y-4 md:space-y-5 lg:space-y-6">
          <h2 className={title({ size: "sm" })}>Our Story</h2>
          <p className="text-default-600 text-xs sm:text-sm md:text-base lg:text-lg leading-relaxed">
            Mind Mesh was founded with a simple yet powerful vision: to create a space where 
            passionate individuals could come together, share ideas, and build something extraordinary. 
            What started as a small group of friends has grown into a thriving community of innovators, 
            creators, and dreamers.
          </p>
          <p className="text-default-600 text-xs sm:text-sm md:text-base lg:text-lg leading-relaxed">
            We believe that the best ideas emerge when diverse minds collaborate. Our club brings 
            together students from various backgrounds, each contributing their unique perspective 
            to create something greater than the sum of its parts.
          </p>
        </CardBody>
      </Card>

      {/* Values Grid */}
      <div className="max-w-7xl mx-auto w-full">
        <h2 className={title({ size: "sm", class: "text-center mb-6 sm:mb-7 md:mb-8 lg:mb-10" })}>
          Our Values
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
          {values.map((value, index) => (
            <Card
              key={index}
              className="border-none hover:scale-105 transition-all duration-300 hover:shadow-xl"
              shadow="sm"
            >
              <CardBody className="p-4 sm:p-5 md:p-6 lg:p-8">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="text-2xl sm:text-3xl md:text-4xl flex-shrink-0">{value.icon}</div>
                  <div className="min-w-0">
                    <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-1 sm:mb-2">{value.title}</h3>
                    <p className="text-default-600 text-xs sm:text-sm md:text-base">{value.description}</p>
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>

      {/* Team Section */}
      <Card className="border-none bg-gradient-to-br from-orange-50 to-pink-50 dark:from-orange-950/30 dark:to-pink-950/30 max-w-7xl mx-auto w-full" shadow="lg">
        <CardBody className="p-4 sm:p-6 md:p-8 lg:p-12 text-center space-y-3 sm:space-y-4 md:space-y-5 lg:space-y-6">
          <h2 className={title({ size: "sm" })}>Meet Our Team</h2>
          <p className="text-default-600 text-xs sm:text-sm md:text-base lg:text-lg">
            Passionate leaders driving innovation and growth
          </p>
          <div className="flex justify-center">
            <AvatarGroup isBordered max={5} size="lg">
              {teamMembers.map((avatar, index) => (
                <Avatar key={index} src={avatar} />
              ))}
            </AvatarGroup>
          </div>
          <div className="flex justify-center gap-1.5 sm:gap-2 md:gap-3 mt-4 sm:mt-5 md:mt-6 flex-wrap">
            <Chip color="primary" variant="flat" className="text-xs sm:text-sm">Leadership</Chip>
            <Chip color="secondary" variant="flat" className="text-xs sm:text-sm">Innovation</Chip>
            <Chip color="success" variant="flat" className="text-xs sm:text-sm">Creativity</Chip>
            <Chip color="warning" variant="flat" className="text-xs sm:text-sm">Excellence</Chip>
          </div>
        </CardBody>
      </Card>

     
    </div>
  );
}