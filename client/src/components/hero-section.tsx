import { Heart, Users, Trophy } from "lucide-react";

const features = [
  {
    icon: Heart,
    title: "Mental Wellness",
    description: "Supporting your emotional recovery journey",
    bgColor: "bg-blue-100",
    iconColor: "text-primary"
  },
  {
    icon: Users,
    title: "Community Support", 
    description: "Connect with others who understand",
    bgColor: "bg-green-100",
    iconColor: "text-accent"
  },
  {
    icon: Trophy,
    title: "Comeback Stories",
    description: "Real athletes, real recoveries",
    bgColor: "bg-amber-100",
    iconColor: "text-yellow-600"
  }
];

export default function HeroSection() {
  return (
    <section id="about" className="bg-white rounded-xl shadow-sm p-6 md:p-8 mb-8">
      <div className="text-center mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-4">
          Why Mental Health Matters in Recovery
        </h2>
        <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
          Injuries don't just affect the body—they can deeply impact the mind. Student-athletes often 
          struggle with identity loss, isolation, and anxiety during recovery. This project is designed 
          to help you stay strong—physically and mentally.
        </p>
      </div>
      <div className="grid md:grid-cols-3 gap-6 mt-8">
        {features.map((feature, index) => (
          <div key={index} className="text-center p-4">
            <div className={`w-16 h-16 ${feature.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}>
              <feature.icon className={`w-8 h-8 ${feature.iconColor}`} />
            </div>
            <h3 className="font-semibold text-slate-800 mb-2">{feature.title}</h3>
            <p className="text-slate-600 text-sm">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
