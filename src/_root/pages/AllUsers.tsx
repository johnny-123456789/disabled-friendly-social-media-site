import { useToast } from "@/components/ui/use-toast";
import { Loader, UserCard } from "@/components/shared";
import { useGetUsers } from "@/lib/react-query/queries";
const ORIGINAL_TEXT = document.body.innerText;
const splitText = (text, from, to) => [
  text.slice(0, from),
  text.slice(from, to),
  text.slice(to),
];
const HighlightedText = ({ text, from, to }) => {
  const [disabled, setDisabled] = React.useState(false);
  const [highlightSection, setHighlightSection] = React.useState({
    from: 0,
    to: 0,
  });
  const handleClick = () => {
    const synth = window.speechSynthesis;
    if (!synth) {
      console.error("no tts");
      return;
    }

    let utterance = new SpeechSynthesisUtterance(ORIGINAL_TEXT);
    utterance.addEventListener("start", () => setDisabled(true));
    utterance.addEventListener("end", () => setDisabled(false));
    utterance.addEventListener("boundary", ({ charIndex, charLength }) => {
      setHighlightSection({ from: charIndex, to: charIndex + charLength });
    });
    synth.speak(utterance);
  };
  const [start, highlight, finish] = splitText(text, from, to);
  return (
    <p>
      {start}
      <span style={{ backgroundColor: "yellow" }}>{highlight}</span>
      {finish}
    </p>
  );
};
const AllUsers = () => {
  const { toast } = useToast();

  const { data: creators, isLoading, isError: isErrorCreators } = useGetUsers();

  if (isErrorCreators) {
    toast({ title: "Something went wrong." });
    
    return;
  }

  return (
    <div className="common-container">
      
      <div className="user-container">
        
        <h2 className="h3-bold md:h2-bold text-left w-full">All Users</h2>
        {isLoading && !creators ? (
          <Loader />
        ) : (
          <ul className="user-grid">
            {creators?.documents.map((creator) => (
              <li key={creator?.$id} className="flex-1 min-w-[200px] w-full  ">
                <UserCard user={creator} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AllUsers;
