window.GRAMMAR = [
  {
    level: "A1",
    title: "Foundation",
    subtitle: "Basic Sentence Building Blocks",
    icon: "基",
    description: "Master the six core patterns that form the backbone of every Mandarin sentence.",
    patterns: [
      {
        name: "Basic SVO",
        nameZh: "主谓宾 Zhǔ Wèi Bīn",
        formula: [["Subject","#27ae60"],["Verb","#2980b9"],["Object","#e67e22"]],
        tip: "Chinese follows the same Subject–Verb–Object order as English. Verbs never conjugate — chī (吃) stays the same for “I eat,” “he eats,” and “they ate.”",
        examples: [
          { parts: [["Wǒ","I",0],["chī","eat",1],["fàn.","rice.",2]] },
          { parts: [["Tā","She",0],["hē","drinks",1],["chá.","tea.",2]] },
          { parts: [["Tā","He",0],["xué","studies",1],["Zhōngwén.","Chinese.",2]] }
        ]
      },
      {
        name: "Identity with 是",
        nameZh: "是字句 Shì Zì Jù",
        formula: [["Subject","#27ae60"],["是 shì","#c0392b"],["Noun","#e67e22"]],
        tip: "是 (shì) means “to be” and links the subject to a noun. Unlike English, you do NOT use 是 with adjectives — only with nouns.",
        examples: [
          { parts: [["Wǒ","I",0],["shì","am",1],["xuéshēng.","a student.",2]] },
          { parts: [["Tā","He",0],["shì","is",1],["lǎo shī.","a teacher.",2]] },
          { parts: [["Zhè","This",0],["shì","is",1],["wǒ de shū.","my book.",2]] }
        ]
      },
      {
        name: "Description with 很",
        nameZh: "很+形容词 Hěn + Xíngróngcí",
        formula: [["Subject","#27ae60"],["很 hěn","#8e44ad"],["Adjective","#2980b9"]],
        tip: "In Chinese, adjectives act as verbs — you don’t need 是. 很 (hěn) bridges subject and adjective. It softens to mean “quite” or is nearly silent in neutral statements.",
        examples: [
          { parts: [["Jīntiān","Today",0],["hěn","is very",1],["lěng.","cold.",2]] },
          { parts: [["Zhège","This",0],["hěn","is very",1],["hǎochī.","delicious.",2]] },
          { parts: [["Zhōngwén","Chinese",0],["hěn","is very",1],["yǒuqù.","interesting.",2]] }
        ]
      },
      {
        name: "Negation with 不",
        nameZh: "不字句 Bù Zì Jù",
        formula: [["Subject","#27ae60"],["不 bù","#c0392b"],["Verb / Adj","#2980b9"]],
        tip: "不 (bù) negates verbs and adjectives in the present or future. Before a 4th-tone word, it changes to bú (2nd tone). For past actions, use 没 (méi) instead.",
        examples: [
          { parts: [["Wǒ","I",0],["bù","don’t",1],["hē kāfēi.","drink coffee.",2]] },
          { parts: [["Tā","She",0],["bú","is not",1],["shì Rìběn rén.","Japanese.",2]] },
          { parts: [["Tā","He",0],["bù","is not",1],["máng.","busy.",2]] }
        ]
      },
      {
        name: "Yes/No Questions with 吗",
        nameZh: "吗字问句 Ma Zì Wènjù",
        formula: [["Statement","#27ae60"],["吗 ma ?","#c0392b"]],
        tip: "Add 吗 (ma) to the end of any statement to turn it into a yes/no question. The word order stays exactly the same — no rearranging needed.",
        examples: [
          { parts: [["Nǐ shì Zhōngguó rén","You are Chinese",0],["ma?","(question)",1]] },
          { parts: [["Nǐ xǐhuān chī yú","You like eating fish",0],["ma?","(question)",1]] },
          { parts: [["Jīntiān lěng","Today is cold",0],["ma?","(question)",1]] }
        ]
      },
      {
        name: "Possession with 的",
        nameZh: "的字结构 De Zì Jiégòu",
        formula: [["Owner","#27ae60"],["的 de","#c0392b"],["Thing Owned","#e67e22"]],
        tip: "的 (de) shows possession, like English “’s.” With close relationships (family, pronouns), 的 is often dropped: 我妈妈 (wǒ māmā) = my mom.",
        examples: [
          { parts: [["wǒ","my",0],["de","’s",1],["māmā","mom",2]] },
          { parts: [["tā","his",0],["de","’s",1],["shǒujī","phone",2]] },
          { parts: [["lǎo shī","the teacher",0],["de","’s",1],["shū","book",2]] }
        ]
      }
    ]
  },
  {
    level: "A2",
    title: "Building Blocks",
    subtitle: "Time, Place & Aspect",
    icon: "语",
    description: "Learn to express when, where, and how things happen — and start talking about the past.",
    patterns: [
      {
        name: "Time Before Verb",
        nameZh: "时间状语 Shíjiān Zhuàngyǔ",
        formula: [["Subject","#27ae60"],["Time","#8e44ad"],["Verb + Object","#2980b9"]],
        tip: "In Chinese, time always comes BEFORE the verb — never after. Think: “I tomorrow go” not “I go tomorrow.” This is one of the biggest word-order differences from English.",
        examples: [
          { parts: [["Wǒ","I",0],["míngtiān","tomorrow",1],["qù Běijīng.","go to Beijing.",2]] },
          { parts: [["Tā","He",0],["zuótiān","yesterday",1],["mǎi le yì běn shū.","bought a book.",2]] },
          { parts: [["Wǒmen","We",0],["xiàwǔ","this afternoon",1],["kāihuì.","have a meeting.",2]] }
        ]
      },
      {
        name: "Location with 在",
        nameZh: "在+地点 Zài + Dìdiǎn",
        formula: [["Subject","#27ae60"],["在 zài","#c0392b"],["Place","#8e44ad"],["Verb + Obj","#2980b9"]],
        tip: "Location phrases with 在 (zài) go BEFORE the verb, not after. Think: “I at-home eat” not “I eat at home.”",
        examples: [
          { parts: [["Wǒ","I",0],["zài","at",1],["jiā","home",2],["chī fàn.","eat.",3]] },
          { parts: [["Tā","He",0],["zài","at",1],["dàxué","university",2],["xué Zhōngwén.","studies Chinese.",3]] },
          { parts: [["Māmā","Mom",0],["zài","in",1],["chúfáng","the kitchen",2],["zuò fàn.","cooks.",3]] }
        ]
      },
      {
        name: "Completed Action with 了",
        nameZh: "了字句 Le Zì Jù",
        formula: [["Subject","#27ae60"],["Verb + 了 le","#c0392b"],["Object","#e67e22"]],
        tip: "了 (le) after a verb marks a completed action. It is NOT a past tense marker — it signals completion or change of state. To negate, use 没 (méi): 我没吃 (wǒ méi chī).",
        examples: [
          { parts: [["Wǒ","I",0],["chīle","ate",1],["zǎofàn.","breakfast.",2]] },
          { parts: [["Tā","She",0],["mǎile","bought",1],["yí jiàn yīfu.","a piece of clothing.",2]] },
          { parts: [["Wǒmen","We",0],["kànle","watched",1],["diànyǐng.","a movie.",2]] }
        ]
      },
      {
        name: "Experience with 过",
        nameZh: "过字句 Guò Zì Jù",
        formula: [["Subject","#27ae60"],["Verb + 过 guò","#c0392b"],["Object","#e67e22"]],
        tip: "过 (guò) after a verb means “have ever done.” It emphasizes life experience. To negate: 没 + Verb + 过 (méi ... guò).",
        examples: [
          { parts: [["Wǒ","I",0],["qùguò","have been to",1],["Zhōngguó.","China.",2]] },
          { parts: [["Nǐ","You",0],["chīguò","have eaten",1],["Běijīng kǎoyā ma?","Peking duck?",2]] },
          { parts: [["Tā","He",0],["méi xuéguò","has never studied",1],["Rìyǔ.","Japanese.",2]] }
        ]
      },
      {
        name: "Ongoing Action with 正在",
        nameZh: "正在+动词 Zhèngzài + Dòngcí",
        formula: [["Subject","#27ae60"],["正在 zhèngzài","#c0392b"],["Verb + Object","#2980b9"]],
        tip: "正在 (zhèngzài) means “right now / in the middle of.” It’s like English “-ing.” You can also use just 在 (zài) for a lighter version.",
        examples: [
          { parts: [["Wǒ","I",0],["zhèngzài","am (right now)",1],["kàn shū.","reading.",2]] },
          { parts: [["Tāmen","They",0],["zhèngzài","are (right now)",1],["chī fàn.","eating.",2]] },
          { parts: [["Tā","She",0],["zhèngzài","is (right now)",1],["dǎ diànhuà.","making a call.",2]] }
        ]
      },
      {
        name: "Ability with 会 & 能",
        nameZh: "会/能+动词 Huì / Néng + Dòngcí",
        formula: [["Subject","#27ae60"],["会/能","#c0392b"],["Verb + Object","#2980b9"]],
        tip: "会 (huì) = learned ability or future certainty. 能 (néng) = physical ability or permission. Think: “I 会 swim” (I learned how) vs. “I 能 swim today” (conditions allow it).",
        examples: [
          { parts: [["Wǒ","I",0],["huì","can",1],["shuō Zhōngwén.","speak Chinese.",2]] },
          { parts: [["Nǐ","You",0],["néng","can",1],["bāng wǒ ma?","help me?",2]] },
          { parts: [["Tā","She",0],["huì","can",1],["kāi chē.","drive.",2]] }
        ]
      }
    ]
  },
  {
    level: "A2+",
    title: "Expanding",
    subtitle: "Connecting Ideas & Expressing Intent",
    icon: "连",
    description: "Start building complex sentences with reasons, comparisons, and multiple actions.",
    patterns: [
      {
        name: "Want / Plan with 想 & 要",
        nameZh: "想/要+动词 Xiǎng / Yào + Dòngcí",
        formula: [["Subject","#27ae60"],["想/要","#c0392b"],["Verb + Object","#2980b9"]],
        tip: "想 (xiǎng) = want to / would like to (softer). 要 (yào) = want to / going to (stronger, also used for future plans).",
        examples: [
          { parts: [["Wǒ","I",0],["xiǎng","want to",1],["chī huǒguō.","eat hot pot.",2]] },
          { parts: [["Tā","He",0],["yào","is going to",1],["qù Shànghǎi.","go to Shanghai.",2]] },
          { parts: [["Wǒmen","We",0],["xiǎng","want to",1],["xué zuò Zhōngguó cài.","learn to cook Chinese food.",2]] }
        ]
      },
      {
        name: "Measure Words",
        nameZh: "量词 Liàngcí",
        formula: [["Number","#8e44ad"],["Measure Word","#c0392b"],["Noun","#e67e22"]],
        tip: "Chinese requires a measure word (classifier) between a number and a noun. 个 (gè) is the most common, used for people and general objects. Each noun type has its own measure word.",
        examples: [
          { parts: [["yí","one",0],["gè","(general)",1],["rén","person",2]] },
          { parts: [["sān","three",0],["běn","(for books)",1],["shū","books",2]] },
          { parts: [["liǎng","two",0],["bēi","(for cups)",1],["kāfēi","coffee",2]] }
        ]
      },
      {
        name: "Serial Verb Construction",
        nameZh: "连动句 Liándòng Jù",
        formula: [["Subject","#27ae60"],["Verb₁ + Obj₁","#2980b9"],["Verb₂ + Obj₂","#e67e22"]],
        tip: "Chain two or more verb phrases together — the first action leads to or enables the second. No connecting word is needed.",
        examples: [
          { parts: [["Wǒ","I",0],["qù chāoshì","go to the supermarket",1],["mǎi dōngxi.","to buy things.",2]] },
          { parts: [["Tā","He",0],["zuò fēijī","takes a plane",1],["qù Běijīng.","to go to Beijing.",2]] },
          { parts: [["Wǒ","I",0],["yòng shǒujī","use my phone",1],["xué Zhōngwén.","to study Chinese.",2]] }
        ]
      },
      {
        name: "Cause & Effect",
        nameZh: "因果句 Yīnguǒ Jù",
        formula: [["因为 yīnwèi","#c0392b"],["Reason","#27ae60"],["所以 suǒyǐ","#c0392b"],["Result","#2980b9"]],
        tip: "因为...所以 (yīnwèi...suǒyǐ) = “because...therefore.” In casual speech, you can drop one half — just 因为 or just 所以.",
        examples: [
          { parts: [["Yīnwèi","Because",0],["xià yǔ le,","it rained,",1],["suǒyǐ","so",2],["wǒ méi qù.","I didn’t go.",3]] },
          { parts: [["Yīnwèi","Because",0],["tā hěn máng,","he’s busy,",1],["suǒyǐ","so",2],["bù néng lái.","he can’t come.",3]] },
          { parts: [["Yīnwèi","Because",0],["tài guì le,","it’s too expensive,",1],["suǒyǐ","so",2],["wǒ méi mǎi.","I didn’t buy it.",3]] }
        ]
      },
      {
        name: "Comparison with 比",
        nameZh: "比字句 Bǐ Zì Jù",
        formula: [["A","#27ae60"],["比 bǐ","#c0392b"],["B","#8e44ad"],["Adjective","#2980b9"]],
        tip: "比 (bǐ) = “than.” A 比 B + Adj means “A is more [adj] than B.” To negate: A 没有 B + Adj (A is not as [adj] as B).",
        examples: [
          { parts: [["Tā","She",0],["bǐ","is more than",1],["wǒ","me",2],["gāo.","tall.",3]] },
          { parts: [["Jīntiān","Today",0],["bǐ","is more than",1],["zuótiān","yesterday",2],["lěng.","cold.",3]] },
          { parts: [["Zhōngwén","Chinese",0],["bǐ","is more than",1],["Yīngwén","English",2],["nán.","difficult.",3]] }
        ]
      },
      {
        name: "Concession with 虽然...但是",
        nameZh: "让步句 Ràngbù Jù",
        formula: [["虽然 suīrán","#c0392b"],["Fact","#27ae60"],["但是 dànshì","#c0392b"],["Contrast","#2980b9"]],
        tip: "虽然...但是 (suīrán...dànshì) = “although...but.” Unlike English, Chinese uses BOTH “although” AND “but” together.",
        examples: [
          { parts: [["Suīrán","Although",0],["hěn lèi,","very tired,",1],["dànshì","but",2],["hěn kāixīn.","very happy.",3]] },
          { parts: [["Suīrán","Although",0],["xià yǔ le,","it rained,",1],["dànshì","but",2],["wǒ háishi qù le.","I still went.",3]] },
          { parts: [["Suīrán","Although",0],["hěn guì,","expensive,",1],["dànshì","but",2],["zhìliàng hěn hǎo.","the quality is good.",3]] }
        ]
      }
    ]
  },
  {
    level: "B1",
    title: "Intermediate",
    subtitle: "Complex Structures & Nuance",
    icon: "文",
    description: "Handle disposal, passive voice, complements, and conditional logic like a natural speaker.",
    patterns: [
      {
        name: "把 Disposal Pattern",
        nameZh: "把字句 Bǎ Zì Jù",
        formula: [["Subject","#27ae60"],["把 bǎ","#c0392b"],["Object","#e67e22"],["Verb + Result","#2980b9"]],
        tip: "把 (bǎ) moves the object before the verb to emphasize what happens TO it. The verb must have a result or direction — you can’t use 把 with a bare verb.",
        examples: [
          { parts: [["Qǐng","Please",0],["bǎ","«把»",1],["mén","the door",2],["guān shàng.","close.",3]] },
          { parts: [["Wǒ","I",0],["bǎ","«把»",1],["shū","the book",2],["fàng zài zhuōzi shàng le.","put on the table.",3]] },
          { parts: [["Tā","He",0],["bǎ","«把»",1],["zuòyè","the homework",2],["zuò wán le.","finished.",3]] }
        ]
      },
      {
        name: "被 Passive Voice",
        nameZh: "被字句 Bèi Zì Jù",
        formula: [["Receiver","#e67e22"],["被 bèi","#c0392b"],["(Agent)","#8e44ad"],["Verb + Result","#2980b9"]],
        tip: "被 (bèi) marks the passive voice. The subject is the one affected. Often used for unfortunate events. The agent (who did it) can be omitted.",
        examples: [
          { parts: [["Dàngāo","The cake",0],["bèi","was (by)",1],["tā","him",2],["chī le.","eaten.",3]] },
          { parts: [["Wǒ de shǒujī","My phone",0],["bèi","was",1],["","(someone)",2],["tōou le.","stolen.",3]] },
          { parts: [["Chuānghù","The window",0],["bèi","was (by)",1],["fēng","the wind",2],["chuī kāi le.","blown open.",3]] }
        ]
      },
      {
        name: "Manner Complement with 得",
        nameZh: "得字补语 Dé Zì Bǔyǔ",
        formula: [["Subject","#27ae60"],["Verb","#2980b9"],["得 de","#c0392b"],["How / Degree","#8e44ad"]],
        tip: "得 (de) after a verb introduces HOW the action is done or to what degree. Note: this 得 is different from 的 (possession) and 地 (adverb marker).",
        examples: [
          { parts: [["Tā","She",0],["shuō Zhōngwén shuō","speaks Chinese",1],["de","«得»",2],["hěn hǎo.","very well.",3]] },
          { parts: [["Tā","He",0],["pǎo","runs",1],["de","«得»",2],["hěn kuài.","very fast.",3]] },
          { parts: [["Wǒ","I",0],["chī","ate",1],["de","«得»",2],["tài duō le.","too much.",3]] }
        ]
      },
      {
        name: "Conditional with 如果...就",
        nameZh: "条件句 Tiáojiàn Jù",
        formula: [["如果 rúguǒ","#c0392b"],["Condition","#27ae60"],["就 jiù","#c0392b"],["Result","#2980b9"]],
        tip: "如果...就 (rúguǒ...jiù) = “if...then.” 就 (jiù) is optional in casual speech. You can also use 要是 (yàoshi) instead of 如果.",
        examples: [
          { parts: [["Rúguǒ","If",0],["míngtiān xià yǔ,","it rains tomorrow,",1],["jiù","then",2],["wǒ bú qù le.","I won’t go.",3]] },
          { parts: [["Rúguǒ","If",0],["nǐ yǒu shíjiān,","you have time,",1],["jiù","then",2],["lái zhǎo wǒ.","come find me.",3]] },
          { parts: [["Rúguǒ","If",0],["nǐ xǐhuān,","you like it,",1],["jiù","then",2],["mǎi ba.","buy it.",3]] }
        ]
      },
      {
        name: "More and More / The More…The More",
        nameZh: "越来越 / 越...越 Yuèláiyuè",
        formula: [["越来越 yuèláiyuè","#c0392b"],["Adjective","#2980b9"]],
        tip: "越来越 (yuèláiyuè) = “more and more.” 越 A 越 B (yuè A yuè B) = “the more A, the more B.”",
        examples: [
          { parts: [["Tiānqì","-",-1],["yuèláiyuè","more and more",0],["lěng le.","cold.",1]] },
          { parts: [["Nǐ de Zhōngwén","-",-1],["yuèláiyuè","more and more",0],["hǎo le.","good.",1]] },
          { parts: [["Yuè","The more",0],["xué","you study,",1],["yuè","the more",0],["yǒuqù.","interesting.",1]] }
        ]
      },
      {
        name: "Simultaneous Actions",
        nameZh: "一边...一边 Yībiān...Yībiān",
        formula: [["一边 yībiān","#c0392b"],["Action A","#27ae60"],["一边 yībiān","#c0392b"],["Action B","#2980b9"]],
        tip: "一边...一边 (yībiān...yībiān) = “doing A while doing B.” Both actions happen at the same time.",
        examples: [
          { parts: [["Tā yībiān","He while",0],["chī fàn,","eating,",1],["yībiān","while",2],["kàn diànshì.","watching TV.",3]] },
          { parts: [["Tā yībiān","She while",0],["zǒu lù,","walking,",1],["yībiān","while",2],["tīng yīnyuè.","listening to music.",3]] },
          { parts: [["Wǒmen yībiān","We while",0],["hē chá,","drinking tea,",1],["yībiān","while",2],["liáotiān.","chatting.",3]] }
        ]
      }
    ]
  },
  {
    level: "B1+",
    title: "Advanced",
    subtitle: "Emphasis, Nuance & Literary Patterns",
    icon: "高",
    description: "Master sophisticated patterns used in natural conversation and written Chinese.",
    patterns: [
      {
        name: "Not Only…But Also",
        nameZh: "不但...而且 Búdàn...Érqiě",
        formula: [["不但 búdàn","#c0392b"],["A","#27ae60"],["而且 érqiě","#c0392b"],["B","#2980b9"]],
        tip: "不但...而且 (búdàn...érqiě) = “not only...but also.” Used to add emphasis by building on the first point.",
        examples: [
          { parts: [["Tā búdàn","He not only",0],["huì shuō Zhōngwén,","speaks Chinese,",1],["érqiě","but also",2],["huì shuō Rìyǔ.","speaks Japanese.",3]] },
          { parts: [["Zhège cài búdàn","This dish not only",0],["hǎokàn,","looks good,",1],["érqiě","but also",2],["hǎochī.","tastes great.",3]] },
          { parts: [["Tā búdàn","She not only",0],["cōngmíng,","is smart,",1],["érqiě","but also",2],["hěn nǔlì.","very hardworking.",3]] }
        ]
      },
      {
        name: "Even… with 连...都/也",
        nameZh: "连...都 Lián...Dōu",
        formula: [["连 lián","#c0392b"],["Emphasized","#e67e22"],["都/也 dōu/yě","#c0392b"],["Verb","#2980b9"]],
        tip: "连...都/也 (lián...dōu/yě) = “even...” Used to emphasize something extreme or surprising.",
        examples: [
          { parts: [["Tā lián","He even",0],["yí gè zì","a single character",1],["dōu","(emphasis)",2],["bú rènshi.","doesn’t recognize.",3]] },
          { parts: [["Wǒ lián","I even",0],["fàn","a meal",1],["dōu","(emphasis)",2],["méi chī.","didn’t eat.",3]] },
          { parts: [["Tā lián","She even",0],["zìjǐ de míngzi","her own name",1],["dōu","(emphasis)",2],["bú huì xiě.","can’t write.",3]] }
        ]
      },
      {
        name: "Besides / Except with 除了...以外",
        nameZh: "除了句 Chúle Jù",
        formula: [["除了 chúle","#c0392b"],["X","#e67e22"],["以外 yǐwài","#c0392b"],["Rest","#2980b9"]],
        tip: "除了...以外 (chúle...yǐwài) = “besides / except.” With 还 (hái) it means “in addition to.” With 都 (dōu) it means “except for.”",
        examples: [
          { parts: [["Chúle","Besides",0],["Zhōngwén","Chinese",1],["yǐwài,","(aside from),",2],["tā hái huì shuō Fǎyǔ.","he also speaks French.",3]] },
          { parts: [["Chúle","Except",0],["xīngqītiān","Sunday",1],["yǐwài,","(aside from),",2],["wǒ měi tiān dōu shàng bān.","I work every day.",3]] },
          { parts: [["Chúle","Except",0],["tā","him",1],["yǐwài,","(aside from),",2],["dàjiā dōu lái le.","everyone came.",3]] }
        ]
      },
      {
        name: "Emphasis with 是...的",
        nameZh: "是...的句 Shì...De Jù",
        formula: [["是 shì","#c0392b"],["Detail (how/when/where)","#8e44ad"],["Verb + 的 de","#c0392b"]],
        tip: "是...的 (shì...de) highlights HOW, WHEN, or WHERE a past action happened. The action itself is known; the focus is on the detail.",
        examples: [
          { parts: [["Wǒ","-",-1],["shì","(emphasis)",0],["zuò fēijī","by plane",1],["lái de.","came.",2]] },
          { parts: [["Tā","-",-1],["shì","(emphasis)",0],["zuótiān","yesterday",1],["dào de.","arrived.",2]] },
          { parts: [["Zhè běn shū","-",-1],["shì","(emphasis)",0],["zài shūdiàn","at a bookstore",1],["mǎi de.","bought.",2]] }
        ]
      },
      {
        name: "As Long As with 只要...就",
        nameZh: "只要句 Zhǐyào Jù",
        formula: [["只要 zhǐyào","#c0392b"],["Condition","#27ae60"],["就 jiù","#c0392b"],["Result","#2980b9"]],
        tip: "只要...就 (zhǐyào...jiù) = “as long as...then.” Expresses a sufficient condition.",
        examples: [
          { parts: [["Zhǐyào","As long as",0],["nǔlì,","you work hard,",1],["jiù","then",2],["néng chénggōng.","you can succeed.",3]] },
          { parts: [["Zhǐyào","As long as",0],["nǐ lái,","you come,",1],["jiù","then",2],["wǒ gāoxìng.","I’m happy.",3]] },
          { parts: [["Zhǐyào","As long as",0],["yǒu shíjiān,","I have time,",1],["jiù","then",2],["qù yùndòng.","I exercise.",3]] }
        ]
      },
      {
        name: "Topic–Comment Structure",
        nameZh: "话题句 Huàtí Jù",
        formula: [["Topic","#e67e22"],["Comment","#27ae60"]],
        tip: "In topic–comment structure, the topic (what you’re talking about) comes first, then the comment (what you say about it). This is a natural pattern in Chinese conversation.",
        examples: [
          { parts: [["Zhōngguó cài","Chinese food,",0],["wǒ hěn xǐhuān.","I like very much.",1]] },
          { parts: [["Zhè jiàn shì","This matter,",0],["wǒ yǐjīng zhīdào le.","I already know.",1]] },
          { parts: [["Nàge diànyǐng","That movie,",0],["wǒ kànguò.","I’ve seen it.",1]] }
        ]
      }
    ]
  }
];
