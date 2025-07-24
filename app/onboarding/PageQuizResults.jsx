import { View, Text, FlatList } from "react-native";
import React from "react";
import { SafeAreaView, KeyboardAvoidingView, Platform } from "react-native";
import Header from "../../components/Text/Header";
import XLHeader from "../../components/Text/XLHeader";
import Subheader from "../../components/Text/Subheader";
import TextButton from "../../components/TextButton";
import { Dimensions } from "react-native";
import RadialGlow from "../../components/RadialGlow";
import RegretCarousel from "../../components/Onboarding/RegretCarousel";
import Animated, {
  Easing,
  FadeInDown,
  FadeInUp,
} from "react-native-reanimated";

const archetypeDescriptions = {
  drifter: {
    title: "The Drifter",
    summary:
      "You lack direction and bounce between ideas without real follow-through.",
    description:
      "You're motivated in bursts, but without a clear path or purpose, your habits never stick. You're stuck in motion without momentum — trying different things but never committing long enough to see real results.",
    keyTraits: ["Inconsistent", "Unfocused", "Easily bored"],
    need: "Clarity, a strong ‘why’, and structure to build traction.",
  },
  staller: {
    title: "The Staller",
    summary:
      "You keep waiting for the perfect time to start — and it never comes.",
    description:
      "You overthink, procrastinate, and avoid taking action until things feel 'just right.' Deep down, you fear failure or doing it wrong, so you delay and stall instead of building momentum.",
    keyTraits: ["Perfectionist", "Procrastinator", "Fearful of failure"],
    need: "Momentum, permission to start messy, and daily nudges forward.",
  },
  burner: {
    title: "The Burner",
    summary: "You go hard out the gate… and then crash.",
    description:
      "You’re intense and capable — but you burn out fast. You try to overhaul everything at once, which feels great at first but quickly becomes unsustainable. You don't need to try harder — you need a system that helps you sustain effort over time.",
    keyTraits: ["All-or-nothing", "Overachiever", "Burns out"],
    need: "Pacing, habit scaling, and consistency-first progress.",
  },
  pleaser: {
    title: "The Pleaser",
    summary:
      "You’re motivated by others — but often lose yourself in the process.",
    description:
      "You show up for others but struggle to do the same for yourself. You want to grow, but your habits are often tied to pleasing people or meeting expectations. You need habits rooted in *your* values — not external validation.",
    keyTraits: ["External validation", "Self-sacrificing", "Approval-seeking"],
    need: "Internal motivation, boundaries, and self-aligned habits.",
  },
  skeptic: {
    title: "The Skeptic",
    summary: "You’ve tried before — and now you question if habits even work.",
    description:
      "You’ve been let down by systems, routines, or your own follow-through. You're cautious and analytical, which protects you — but can also block progress. You don’t want fluff — you want proof that this time will be different.",
    keyTraits: ["Disillusioned", "Guarded", "Rational"],
    need: "Evidence, clear wins, and trust in a proven system.",
  },
};

const PageQuizResults = ({ goToPage, userArchetype }) => {
  if (!userArchetype) {
    return;
  }

  return (
    <View className="flex flex-1 w-full items-center justify-between p-8">
      <View></View>
      <View>
        <View className="mb-8 gap-4 items-center">
          <XLHeader>You align most with:</XLHeader>
        
            <XLHeader>
              <Text className="font-lora-bold text-5xl italic color-habitColors-blue-up">
                "{archetypeDescriptions[userArchetype].title}"
              </Text>
            </XLHeader>
          
        </View>
        <View className="items-start">
          <Header>Does this sound like you?</Header>
           <View
              
              className="p-4 border-2 border-background-80 rounded-xl"
            >
              <Subheader>{archetypeDescriptions[userArchetype].summary}</Subheader>
            </View>
          
        </View>
      </View>
      <View className="gap-4 p-2">
        <Header>Key Traits</Header>
        <View className="flex-row flex-wrap justify-center gap-4">
          {archetypeDescriptions[userArchetype].keyTraits.map((trait) => (
            <View
              key={trait}
              className="p-4 border-2 border-background-80 rounded-xl"
            >
              <Header>{trait}</Header>
            </View>
          ))}
        </View>
      </View>
      <View className="gap-4">
        <Header>Your Need</Header>

        <View className="p-4 border-2 border-habitColors-blue-up rounded-xl">
          <Header>{archetypeDescriptions[userArchetype].need}</Header>
        </View>
      </View>
      <View className="w-full">
        <View
          className="flex-row"
          
        >
          <TextButton
            type="solid"
            text="Choose your focuses"
            onPress={() => goToPage(3)}
          />
        </View>
      </View>
    </View>
  );
};

export default PageQuizResults;
