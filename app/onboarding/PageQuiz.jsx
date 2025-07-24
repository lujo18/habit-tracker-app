import {
  View,
  Text,
  FlatList,
  ScrollView,
  LayoutAnimation,
  TouchableOpacity,
  Image,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { SafeAreaView, KeyboardAvoidingView, Platform } from "react-native";
import Header from "../../components/Text/Header";
import XLHeader from "../../components/Text/XLHeader";
import Subheader from "../../components/Text/Subheader";
import TextButton from "../../components/TextButton";
import { Dimensions } from "react-native";
import RadialGlow from "../../components/RadialGlow";
import RegretCarousel from "../../components/Onboarding/RegretCarousel";
import SwitchCheck from "../../components/SwitchCheck";
import Animated, {
  FadingTransition,
  LinearTransition,
  Easing,
} from "react-native-reanimated";
import LottieView from "lottie-react-native";
import PagerView from "react-native-pager-view";
import icons from "../../constants/icons";
import tailwindConfig from "../../tailwind.config";

const tailwindColors = tailwindConfig.theme.extend.colors;

const habitArchetypes = ["drifter", "staller", "burner", "pleaser", "skeptic"];

const quizQuestions = [
  {
    question: "What’s the real reason you struggle with habits?",
    options: [
      {
        name: "I'm not clear on what I truly want",
        arch: "drifter",
        typeIndex: 0,
      },
      { name: "I can't stay consistent", arch: "staller", typeIndex: 1 },
      { name: "I'm always drained or exhausted", arch: "burner", typeIndex: 2 },
      {
        name: "I forget myself trying to help everyone else",
        arch: "pleaser",
        typeIndex: 3,
      },
    ],
  },
  {
    question: "Which of these thoughts hits hardest?",
    options: [
      { name: "I'll get serious tomorrow...", arch: "staller", typeIndex: 1 },
      {
        name: "What am I even doing with my life?",
        arch: "drifter",
        typeIndex: 0,
      },
      { name: "I can't keep up anymore.", arch: "burner", typeIndex: 2 },
      { name: "I don't know what I want.", arch: "pleaser", typeIndex: 3 },
      { name: "Nothing I try really sticks.", arch: "skeptic", typeIndex: 4 },
    ],
  },
  {
    question: "If you could fix just one thing today, what would it be?",
    options: [
      { name: "My self-discipline", arch: "staller", typeIndex: 1 },
      { name: "My energy and focus", arch: "burner", typeIndex: 2 },
      { name: "My direction and purpose", arch: "drifter", typeIndex: 0 },
      { name: "My confidence in saying no", arch: "pleaser", typeIndex: 3 },
    ],
  },
  {
    question: "What emotion do you feel most often?",
    options: [
      { name: "Numb or lost", arch: "drifter", typeIndex: 0 },
      { name: "Guilty or unmotivated", arch: "staller", typeIndex: 1 },
      { name: "Tired and stressed", arch: "burner", typeIndex: 2 },
      { name: "Anxious or unsure", arch: "pleaser", typeIndex: 3 },
      { name: "Frustrated or skeptical", arch: "skeptic", typeIndex: 4 },
    ],
  },
];

const PageQuiz = ({ goToPage, fullScreenGradient, setArchetype }) => {
  const pagerRef = useRef(null);

  const [questionResponses, setQuestionResponses] = useState([]);

  const goToQuestion = (index) => {
    console.log("TEST");
    pagerRef.current?.setPage(index);
  };

  const addQuestionResponse = (typeIndex, questionIndex) => {
    console.log("Text", typeIndex, questionIndex);
    setQuestionResponses((prev) => {
      const answers = [...prev];
      answers[questionIndex] = typeIndex;
      return answers;
    });
  };

  const getArchetype = () => {
    const typeIndexs = Array.from({length: habitArchetypes.length}, () => 0)

    for (const types of questionResponses) {
      typeIndexs[types]++
    }

    const archetype = habitArchetypes[typeIndexs.indexOf(Math.max(...typeIndexs))]

    setArchetype(archetype)
  }

  return (
    <Animated.View
      className="flex-1 items-center justify-center"
      layout={FadingTransition.duration(1000)}
    >
      {false ? (
        // <LottieView style={{width: "50%", height:"50%"}} autoPlay={true} ref={animation} source={loadingAnimation}/>
        <Header>Loading...</Header>
      ) : (
        <View className="flex flex-1 w-full items-start justify-between gap-4 p-8">
          <PagerView
            ref={pagerRef}
            initialPage={0}
            scrollEnabled={false}
            style={{ flex: 1, width: "100%" }}
          >
            {quizQuestions.map((page, pageIdx) => (
              <View className="flex-1 gap-4" key={pageIdx}>
                {pageIdx > 0 && <TouchableOpacity onPress={() => goToQuestion(pageIdx - 1)}>
                  <Image
                    source={icons.arrowRightSLine}
                    className="w-9 h-9"
                    resizeMode="cover"
                    tintColor={tailwindColors["highlight"]["90"]}
                    style={{ transform: [{ scaleX: -1 }] }}
                  />
                </TouchableOpacity>}
                <View className=" ">
                  <View className="mb-8 gap-2 items-center">
                    <XLHeader>
                      {page.question}
                      {/* <Text className="font-lora-bold text-3xl italic color-habitColors-blue-up">
                        Personalization
                      </Text>{" "}
                      quiz */}
                    </XLHeader>
                  </View>
                  <View className="gap-4">
                    <Subheader>Choose one:</Subheader>
                  </View>
                </View>
                <View className="gap-4">
                  {page.options.map((option, optionIdx) => (
                    <TouchableOpacity
                      className={`border-2 rounded-xl p-4 ${
                        questionResponses[pageIdx] == option.typeIndex
                          ? "border-highlight-60"
                          : "border-background-80"
                      }`}
                      key={optionIdx}
                      onPress={() => {
                        addQuestionResponse(option.typeIndex, pageIdx);
                        pageIdx < quizQuestions.length - 1
                          ? goToQuestion(pageIdx + 1)
                          : null;
                      }}
                    >
                      <Header>
                        {optionIdx + 1}. {option.name}
                      </Header>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            ))}
          </PagerView>

          <View className="w-full items-center justify-between gap-4">
            <View className="w-full">
              <View className="flex-row">
                {questionResponses.length === quizQuestions.length && (
                  <TextButton
                    disabled={questionResponses.length < quizQuestions.length}
                    type="solid"
                    text="I'm ready"
                    onPress={() => {getArchetype(); goToPage(2)}}
                  />
                )}
              </View>
            </View>
          </View>
        </View>
      )}
    </Animated.View>
  );
};

export default PageQuiz;
