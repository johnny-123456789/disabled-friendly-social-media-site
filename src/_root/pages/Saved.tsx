import { Models } from "appwrite";
import React from "react";
import { GridPostList, Loader } from "@/components/shared";
import { useGetCurrentUser } from "@/lib/react-query/queries";
const ORIGINAL_TEXT = document.body.innerText;
const splitText = (text, from, to) => [
  text.slice(0, from),
  text.slice(from, to),
  text.slice(to),
];
const HighlightedText = ({ text, from, to }) => {
  const [start, highlight, finish] = splitText(text, from, to);
  return (
    <p>
      {start}
      <span style={{ backgroundColor: "yellow" }}>{highlight}</span>
      {finish}
    </p>
  );
};
const Saved = () => {
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
  const { data: currentUser } = useGetCurrentUser();

  const savePosts = currentUser?.save
    .map((savePost: Models.Document) => ({
      ...savePost.post,
      creator: {
        imageUrl: currentUser.imageUrl,
      },
    }))
    .reverse();

  return (
    <div className="saved-container">
      <button disabled={disabled} onClick={handleClick}>
        Narrate
      </button>
      <div className="flex gap-2 w-full max-w-5xl">
        <img
          src="/assets/icons/save.svg"
          width={36}
          height={36}
          alt="edit"
          className="invert-white"
        />
        <h2 className="h3-bold md:h2-bold text-left w-full">Saved Posts</h2>
      </div>

      {!currentUser ? (
        <Loader />
      ) : (
        <ul className="w-full flex justify-center max-w-5xl gap-9">
          {savePosts.length === 0 ? (
            <p className="text-light-4">No available posts</p>
          ) : (
            <GridPostList posts={savePosts} showStats={false} />
          )}
        </ul>
      )}
    </div>
  );
};

export default Saved;
