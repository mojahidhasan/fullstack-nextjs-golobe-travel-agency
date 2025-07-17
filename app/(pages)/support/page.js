"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const faqData = [
  {
    question: "How do I reset my password?",
    answer:
      'To reset your password, go to the Account Settings and click "Change Password".',
  },
  {
    question: "How can I update my payment method?",
    answer:
      "Navigate to Payment Settings and add or update your payment methods there.",
  },
  {
    question: "How do I delete my account?",
    answer:
      "Go to Account Settings and use the Delete Account option. Be aware this action is irreversible.",
  },
  {
    question: "How do I contact support?",
    answer: "Use the contact form below or email us at support@example.com.",
  },
];

export default function SupportPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [openIndex, setOpenIndex] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const filteredFaq = faqData.filter(
    (item) =>
      item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Submit support ticket API integration
    alert("Support request submitted successfully!");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="mx-auto max-w-[1440px] space-y-10 py-10">
      {/* Search Help Articles */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Search Help Articles
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Search FAQs, guides, and articles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-4"
          />
          {filteredFaq.length === 0 && <p>No results found.</p>}
          {filteredFaq.map((item, idx) => (
            <div key={idx} className="mb-3">
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full rounded bg-gray-100 px-3 py-2 text-left font-semibold"
                aria-expanded={openIndex === idx}
              >
                {item.question}
              </button>
              {openIndex === idx && (
                <p className="rounded border border-gray-200 p-3">
                  {item.answer}
                </p>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Contact Support */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Contact Support
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <Input
              name="email"
              type="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <Input
              name="subject"
              placeholder="Subject"
              value={formData.subject}
              onChange={handleChange}
              required
            />
            <textarea
              name="message"
              placeholder="Message"
              value={formData.message}
              onChange={handleChange}
              required
              rows={5}
              className="w-full resize-none rounded border border-gray-300 p-2"
            />
            <Button type="submit">Submit</Button>
          </form>
        </CardContent>
      </Card>

      {/* Live Chat / Helpdesk */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Live Chat Support
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            Chat with our support team 24/7 for immediate assistance.
          </p>
          <Button disabled>Start Live Chat (Coming Soon)</Button>
        </CardContent>
      </Card>

      {/* Support Resources */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Support Resources
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-inside list-disc space-y-2">
            <li>
              <a
                href="https://docs.example.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Documentation
              </a>
            </li>
            <li>
              <a
                href="https://community.example.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Community Forums
              </a>
            </li>
            <li>
              <a
                href="https://tutorials.example.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Tutorials
              </a>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
