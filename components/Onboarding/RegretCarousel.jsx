import React, { useRef, useEffect, useState } from "react";
import { Text, View, Dimensions } from "react-native";
import PagerView from "react-native-pager-view";
import Header from "../Text/Header";
import Subheader from "../Text/Subheader";

const { width } = Dimensions.get("window");

const regrets = [
  "I wish I had the courage to live a life true to myself.",
  "I spent my whole life working. I missed my kids growing up.",
  "I wish I hadn’t wasted so much time being afraid.",
  "I regret all the chances I didn’t take.",
  "I stayed in a safe job for 40 years. I never tried to do what I really loved.",
  "I regret the silence. The words I never said.",
  "I wish I had let myself be happy.",
];

export default function RegretCarousel() {
  const pagerRef = useRef(null);
  const [page, setPage] = useState(0);

  // Auto-slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const nextPage = (page + 1) % regrets.length;
      pagerRef.current?.setPage(nextPage);
      setPage(nextPage);
    }, 5000);
    return () => clearInterval(interval);
  }, [page]);

  return (
    <PagerView
      style={{ height: 100, width: "100%"}}
      initialPage={0}
      ref={pagerRef}
      onPageSelected={(e) => setPage(e.nativeEvent.position)}
    >
      {regrets.map((quote, i) => (
        <View
          key={i}
          className="items-center"
        >
          <Header className="text-center">
            "{quote}"
          </Header>
          <Subheader>
            #DeathtoRegret
          </Subheader>
        </View>
      ))}
    </PagerView>
  );
}
