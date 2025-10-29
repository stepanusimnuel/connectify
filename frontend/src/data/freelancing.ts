export interface CardData {
  image: string;
  title: string;
  subtitle: string;
  buttonText: string;
}

export const hiringCards: CardData[] = [
  {
    image: "/popular-services/1.png",
    title: "Posting a Project is Free!",
    subtitle: "Generate a project post with AI or create your own and filter talent matches.",
    buttonText: "Post Project",
  },
  {
    image: "/popular-services/1.png",
    title: "Search for Freelancers",
    subtitle: "Screen, interview, or book a consult with a  freelancer before hiring.",
    buttonText: "Explore Freelancers",
  },
  {
    image: "/popular-services/1.png",
    title: "Pay when Work is Done",
    subtitle: "Release payments after approving work, by milestone or upon project completion.",
    buttonText: "View Pricing",
  },
];

// Card data untuk freelancer
export const workingCards: CardData[] = [
  {
    image: "/popular-services/1.png",
    title: "Find a Project",
    subtitle: "Browse and apply for projects that match your expertise.",
    buttonText: "Find Project",
  },
  {
    image: "/popular-services/1.png",
    title: "Build Your Profile",
    subtitle: "Showcase your skills and past work to attract more clients.",
    buttonText: "Build Profile",
  },
  {
    image: "/popular-services/1.png",
    title: "Level Up",
    subtitle: "Earn badges and increase your visibility with great performance.",
    buttonText: "Level Up",
  },
];
