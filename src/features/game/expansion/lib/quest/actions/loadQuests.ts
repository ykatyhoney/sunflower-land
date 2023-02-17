import { BUMPKIN_QUEST_IDS, QuestName } from "features/game/types/quests";
import { hasCompletedQuest } from "lib/blockchain/Quests";
import { wallet } from "lib/blockchain/wallet";

export async function loadQuests(quests: QuestName[], bumpkinId: number) {
  const IDS = quests.map((name) => BUMPKIN_QUEST_IDS[name]);

  const statuses = await hasCompletedQuest(
    wallet.web3Provider,
    wallet.myAccount,
    IDS,
    bumpkinId
  );
  return quests.map((name, index) => ({
    name,
    isComplete: statuses[index],
  }));
}
