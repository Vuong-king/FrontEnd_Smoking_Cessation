import { Card, Button, Divider, Typography } from "antd";
import { Book, Users, MessageSquare, Phone, Info } from "lucide-react";
import ColourfulText from "../../ui/ColourfulText";


const { Title, Paragraph, Text } = Typography;

const Support = () => {
  // Mock support resources
  const supportResources = [
    {
      id: 1,
      title: "24/7 Helpline",
      description: "Talk to a professional counselor anytime",
      icon: <Phone className="h-6 w-6 text-blue-500" />,
      contact: "0123456789",
      type: "phone",
    },
    {
      id: 2,
      title: "Community Forum",
      description: "Connect with others on their quitting journey",
      icon: <Users className="h-6 w-6 text-green-500" />,
      type: "link",
      url: "/community",
    },
    {
      id: 3,
      title: "Smoking Cessation Coach",
      description: "Schedule a one-on-one session",
      icon: <MessageSquare className="h-6 w-6 text-purple-500" />,
      type: "schedule",
    },
    {
      id: 4,
      title: "Health Resources",
      description: "Articles and resources about quitting smoking",
      icon: <Book className="h-6 w-6 text-yellow-500" />,
      type: "link",
      url: "/resources",
    },
  ];

  // Mock frequently asked questions
  const faqs = [
    {
      question: "What are withdrawal symptoms I might experience?",
      answer:
        "Common withdrawal symptoms include irritability, anxiety, difficulty concentrating, increased appetite, and strong cravings. Most physical symptoms peak within the first week and gradually decrease over time.",
    },
    {
      question: "How long does nicotine stay in my system?",
      answer:
        "Nicotine can be detected in your blood for about 1-3 days after use. However, nicotine byproducts like cotinine may be detectable for up to 1-2 weeks.",
    },
    {
      question: "What are some strategies to deal with cravings?",
      answer:
        "Try the 4 Ds: Delay (wait it out), Deep breathing, Drink water, and Distract yourself. Also, avoid triggers, chew gum, exercise, or call a support person.",
    },
    {
      question: "How soon will I feel health benefits after quitting?",
      answer:
        "Within 20 minutes, your heart rate drops. Within 12 hours, carbon monoxide levels normalize. Within 2 weeks to 3 months, circulation improves and lung function increases. Benefits continue to accumulate over years.",
    },
    {
      question: "What if I slip up and smoke?",
      answer:
        "Don't be too hard on yourself. One slip doesn't mean failure. Learn from what triggered the slip, recommit to quitting, and continue with your quit plan. Consider it a learning experience rather than a failure.",
    },
  ];

  return (
    <div className="min-h-screen p-2 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent mb-4">
            Support & <ColourfulText text="Resources" />
          </h1>
          <p className="text-lg text-gray-600">
            We're here to help on your quit journey
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
          {/* Support Resources */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Support Resources
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {supportResources.map((resource) => (
                <Card
                  key={resource.id}
                  hoverable
                  className="bg-white border border-gray-200 shadow-md"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      {resource.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">
                        {resource.title}
                      </h3>
                      <p className="text-gray-600 mb-4">
                        {resource.description}
                      </p>
                      {resource.type === "phone" && (
                        <Button
                          type="primary"
                          size="large"
                          className="bg-blue-500 hover:bg-blue-600"
                        >
                          Call {resource.contact}
                        </Button>
                      )}
                      {resource.type === "link" && (
                        <Button
                          type="primary"
                          size="large"
                          className="bg-green-500 hover:bg-green-600"
                        >
                          Visit Now
                        </Button>
                      )}
                      {resource.type === "schedule" && (
                        <Button
                          type="primary"
                          size="large"
                          className="bg-purple-500 hover:bg-purple-600"
                        >
                          Schedule Session
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <Divider className="border-gray-200 my-8" />

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Info className="h-6 w-6 text-blue-400" />
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <Card
                    key={index}
                    className="bg-white border border-gray-200 shadow-md"
                    title={
                      <span className="text-gray-800 font-semibold">
                        {faq.question}
                      </span>
                    }
                  >
                    <p className="text-gray-600">{faq.answer}</p>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;
