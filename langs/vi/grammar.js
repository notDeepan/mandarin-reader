window.GRAMMAR = [
  {
    level: "A1",
    title: "Foundation",
    subtitle: "Basic Sentence Building Blocks",
    icon: "Nền",
    description: "Master the six core patterns behind almost every simple Vietnamese sentence.",
    patterns: [
      {
        name: "Basic SVO",
        nameTarget: "Chủ ngữ + Động từ + Tân ngữ",
        formula: [["Subject", "#27ae60"], ["Verb", "#2980b9"], ["Object", "#e67e22"]],
        tip: "Vietnamese uses the same Subject–Verb–Object order as English. Verbs never change form: ăn is the same for I, she and they, past or future.",
        examples: [
          { parts: [["Tôi", "I", 0], ["ăn", "eat", 1], ["cơm.", "rice.", 2]] },
          { parts: [["Má", "Mom", 0], ["uống", "drinks", 1], ["cà phê.", "coffee.", 2]] },
          { parts: [["Lan", "Lan", 0], ["học", "studies", 1], ["tiếng Anh.", "English.", 2]] }
        ]
      },
      {
        name: "Identity with là",
        nameTarget: "Câu với là",
        formula: [["Subject", "#27ae60"], ["là", "#c0392b"], ["Noun", "#e67e22"]],
        tip: "là links a subject to a noun: Tôi là học sinh. Never put là in front of an adjective — say Cô ấy đẹp, not Cô ấy là đẹp.",
        examples: [
          { parts: [["Tôi", "I", 0], ["là", "am", 1], ["học sinh.", "a student.", 2]] },
          { parts: [["Ba tôi", "My dad", 0], ["là", "is", 1], ["bác sĩ.", "a doctor.", 2]] },
          { parts: [["Đây", "This", 0], ["là", "is", 1], ["nhà tôi.", "my house.", 2]] }
        ]
      },
      {
        name: "Adjectives as Predicates",
        nameTarget: "Tính từ làm vị ngữ",
        formula: [["Subject", "#27ae60"], ["rất / lắm", "#8e44ad"], ["Adjective", "#2980b9"]],
        tip: "Adjectives act like verbs, so no 'to be' is needed: Trời nóng = It's hot. Put rất (very) before the adjective, or lắm / quá after it.",
        examples: [
          { parts: [["Trời", "It", 0], ["rất", "is very", 1], ["nóng.", "hot.", 2]] },
          { parts: [["Phở", "Phở", 0], ["rất", "is very", 1], ["ngon.", "tasty.", 2]] },
          { parts: [["Em gái tôi", "My sister", 0], ["dễ thương", "is cute", 2], ["lắm.", "so very.", 1]] }
        ]
      },
      {
        name: "Negation with không",
        nameTarget: "Phủ định với không",
        formula: [["Subject", "#27ae60"], ["không", "#c0392b"], ["Verb / Adjective", "#2980b9"]],
        tip: "Put không right before the verb or adjective. With là, say không phải là: Tôi không phải là bác sĩ.",
        examples: [
          { parts: [["Tôi", "I", 0], ["không", "don't", 1], ["thích cà phê.", "like coffee.", 2]] },
          { parts: [["Chợ", "The market", 0], ["không", "isn't", 1], ["đông.", "crowded.", 2]] },
          { parts: [["Anh ấy", "He", 0], ["không phải là", "isn't", 1], ["người Sài Gòn.", "from Saigon.", 2]] }
        ]
      },
      {
        name: "Yes/No Questions with không?",
        nameTarget: "Câu hỏi ... không?",
        formula: [["Statement", "#27ae60"], ["không?", "#c0392b"]],
        tip: "Add không? to the end of a statement to make a yes/no question. Answer có / dạ (yes) or không (no). In casual Southern speech you'll also hear hông? and hả?",
        examples: [
          { parts: [["Bạn thích phở", "You like phở", 0], ["không?", "(question)", 1]] },
          { parts: [["Em mệt", "You're tired", 0], ["không?", "(question)", 1]] },
          { parts: [["Đi chơi vui", "The trip was fun", 0], ["không?", "(question)", 1]] }
        ]
      },
      {
        name: "Possession with của",
        nameTarget: "Sở hữu với của",
        formula: [["Thing", "#e67e22"], ["của", "#c0392b"], ["Owner", "#27ae60"]],
        tip: "Possession goes Thing + của + Owner — the reverse of English. In everyday speech của is often dropped: nhà tôi = my house.",
        examples: [
          { parts: [["Bánh mì", "bánh mì", 0], ["của", "of", 1], ["má tôi.", "my mom.", 2]] },
          { parts: [["Điện thoại", "the phone", 0], ["của", "of", 1], ["Lan.", "Lan.", 2]] },
          { parts: [["Nhà", "house", 0], ["tôi", "my", 2], ["ở Quận 3.", "is in District 3.", -1]] }
        ]
      }
    ]
  },
  {
    level: "A2",
    title: "Building Blocks",
    subtitle: "Time, Place and Tense",
    icon: "Xây",
    description: "Talk about when and where things happen, and whether they are done, happening or still to come.",
    patterns: [
      {
        name: "Time Words First",
        nameTarget: "Từ chỉ thời gian",
        formula: [["Time", "#8e44ad"], ["Subject", "#27ae60"], ["Verb", "#2980b9"]],
        tip: "Time words usually come first: Hôm nay tôi đi làm. In casual speech they can go at the end too, but the front is always safe.",
        examples: [
          { parts: [["Hôm nay,", "Today,", 0], ["tôi", "I", 1], ["đi làm.", "go to work.", 2]] },
          { parts: [["Tối qua,", "Last night,", 0], ["tôi", "I", 1], ["ngủ sớm.", "went to bed early.", 2]] },
          { parts: [["Chủ nhật,", "On Sunday,", 0], ["tụi tôi", "we", 1], ["đi chơi.", "go out.", 2]] }
        ]
      },
      {
        name: "Tense Markers đã / đang / sẽ",
        nameTarget: "Đã, đang, sẽ",
        formula: [["Subject", "#27ae60"], ["đã / đang / sẽ", "#c0392b"], ["Verb", "#2980b9"]],
        tip: "Verbs don't change for tense. Add đã (past), đang (in progress) or sẽ (future) before the verb when you need to be clear. Often a time word is enough on its own.",
        examples: [
          { parts: [["Tôi", "I", 0], ["đã", "(past)", 1], ["ăn sáng.", "had breakfast.", 2]] },
          { parts: [["Má", "Mom", 0], ["đang", "is", 1], ["nấu cơm.", "cooking.", 2]] },
          { parts: [["Ngày mai tôi", "Tomorrow I", 0], ["sẽ", "will", 1], ["về quê.", "go home.", 2]] }
        ]
      },
      {
        name: "Location with ở",
        nameTarget: "Ở + nơi chốn",
        formula: [["Subject", "#27ae60"], ["Verb", "#2980b9"], ["ở", "#c0392b"], ["Place", "#e67e22"]],
        tip: "ở means 'at / in', and on its own also 'to live': Tôi ở Quận 3. After another verb it marks where: Ba làm việc ở bệnh viện.",
        examples: [
          { parts: [["Tôi", "I", 0], ["sống", "live", 1], ["ở", "in", 2], ["Sài Gòn.", "Saigon.", 3]] },
          { parts: [["Ba", "Dad", 0], ["làm việc", "works", 1], ["ở", "at", 2], ["bệnh viện.", "a hospital.", 3]] },
          { parts: [["Tụi tôi", "We", 0], ["ăn", "eat", 1], ["ở", "at", 2], ["quán cô Tư.", "Cô Tư's place.", 3]] }
        ]
      },
      {
        name: "Questions with có ... không?",
        nameTarget: "Có ... không?",
        formula: [["Subject", "#27ae60"], ["có", "#c0392b"], ["Verb / Adjective", "#2980b9"], ["không?", "#c0392b"]],
        tip: "có ... không? asks 'do you / is it ...?'. Answer có (yes) or không (no). It sounds a little more careful than ending with không? alone.",
        examples: [
          { parts: [["Bạn", "You", 0], ["có", "do", 1], ["thích phở", "like phở", 2], ["không?", "(question)", 3]] },
          { parts: [["Em", "You", 0], ["có", "are", 1], ["mệt", "tired", 2], ["không?", "(question)", 3]] },
          { parts: [["Anh", "You", 0], ["có", "do", 1], ["biết đường", "know the way", 2], ["không?", "(question)", 3]] }
        ]
      },
      {
        name: "Already with rồi",
        nameTarget: "Rồi: việc đã xong",
        formula: [["Subject", "#27ae60"], ["(đã)", "#8e44ad"], ["Verb", "#2980b9"], ["rồi", "#c0392b"]],
        tip: "rồi at the end means it has already happened. Ask with chưa? (yet?): Con ăn cơm chưa? — Dạ, con ăn rồi.",
        examples: [
          { parts: [["Con", "I", 0], ["ăn", "have eaten", 2], ["rồi.", "already.", 3]] },
          { parts: [["Tôi", "I", 0], ["đã", "(past)", 1], ["làm xong", "finished", 2], ["rồi.", "already.", 3]] },
          { parts: [["Trời", "The rain", 0], ["hết mưa", "has stopped", 2], ["rồi.", "now.", 3]] }
        ]
      },
      {
        name: "Ability with được",
        nameTarget: "Được: có thể / được phép",
        formula: [["Subject", "#27ae60"], ["Verb", "#2980b9"], ["được", "#c0392b"]],
        tip: "Verb + được means 'can (manage to)': Tôi nói được tiếng Việt. For 'can't', Southern speakers often say Verb + không được: Tôi ngủ không được. Được before a verb means 'get to': Em được nghỉ.",
        examples: [
          { parts: [["Tôi", "I", 0], ["nói", "speak", 1], ["được", "can", 2], ["tiếng Việt.", "Vietnamese.", -1]] },
          { parts: [["Tôi", "I", 0], ["ngủ không", "sleep (not)", 1], ["được.", "can.", 2]] },
          { parts: [["Em", "I", 0], ["được", "get to", 2], ["nghỉ ba ngày.", "take three days off.", 1]] }
        ]
      }
    ]
  },
  {
    level: "A2+",
    title: "Expanding",
    subtitle: "Linking Ideas Together",
    icon: "Mở",
    description: "Count things, say what you want, and join ideas with because, although and if.",
    patterns: [
      {
        name: "Classifiers",
        nameTarget: "Loại từ",
        formula: [["Number", "#8e44ad"], ["Classifier", "#c0392b"], ["Noun", "#e67e22"]],
        tip: "Counting needs a classifier between the number and the noun: con for animals, cái for most objects, chiếc for vehicles and single items, cuốn / quyển for books.",
        examples: [
          { parts: [["hai", "two", 0], ["con", "(animal)", 1], ["chó", "dogs", 2]] },
          { parts: [["một", "one", 0], ["cái", "(thing)", 1], ["áo", "shirt", 2]] },
          { parts: [["ba", "three", 0], ["cuốn", "(book)", 1], ["sách", "books", 2]] }
        ]
      },
      {
        name: "Want / Plan with muốn and định",
        nameTarget: "Muốn / định / tính",
        formula: [["Subject", "#27ae60"], ["muốn / định", "#c0392b"], ["Verb", "#2980b9"]],
        tip: "muốn = want to, định = plan to. Southern speakers also say tính for 'plan to': Tụi tôi tính chuyển nhà.",
        examples: [
          { parts: [["Tôi", "I", 0], ["muốn", "want to", 1], ["học nấu ăn.", "learn to cook.", 2]] },
          { parts: [["Bảo", "Bảo", 0], ["định", "plans to", 1], ["đi Đà Lạt.", "go to Đà Lạt.", 2]] },
          { parts: [["Tụi tôi", "We", 0], ["tính", "plan to", 1], ["chuyển nhà.", "move house.", 2]] }
        ]
      },
      {
        name: "Cause & Effect with vì ... nên",
        nameTarget: "Vì ... nên ...",
        formula: [["vì", "#c0392b"], ["Cause", "#e67e22"], ["nên", "#c0392b"], ["Result", "#27ae60"]],
        tip: "vì (because) introduces the reason and nên (so) the result. You can use either one alone, or both together in one sentence.",
        examples: [
          { parts: [["Vì", "Because", 0], ["trời mưa", "it rained", 1], ["nên", "so", 2], ["tôi ở nhà.", "I stayed home.", 3]] },
          { parts: [["Vì", "Because of", 0], ["kẹt xe", "traffic", 1], ["nên", "so", 2], ["tôi tới trễ.", "I was late.", 3]] },
          { parts: [["Vì", "Because", 0], ["bị bệnh", "I was sick", 1], ["nên", "so", 2], ["em xin nghỉ.", "I took the day off.", 3]] }
        ]
      },
      {
        name: "Comparison with hơn",
        nameTarget: "So sánh với hơn",
        formula: [["A", "#27ae60"], ["Adjective", "#2980b9"], ["hơn", "#c0392b"], ["B", "#e67e22"]],
        tip: "A + adjective + hơn + B = A is more ... than B. Add nhiều for 'much more': ngọt hơn nhiều. For 'the most', use nhất.",
        examples: [
          { parts: [["Dâu Đà Lạt", "Đà Lạt strawberries are", 0], ["ngọt", "sweeter", 1], ["hơn", "than", 2], ["dâu Sài Gòn.", "Saigon ones.", 3]] },
          { parts: [["Grab", "Grab is", 0], ["tiện", "more convenient", 1], ["hơn", "than", 2], ["xe ôm.", "a xe ôm.", 3]] },
          { parts: [["Phòng mới", "The new room is", 0], ["nhỏ", "smaller", 1], ["hơn", "than", 2], ["nhà cũ.", "the old home.", 3]] }
        ]
      },
      {
        name: "Concession with tuy ... nhưng",
        nameTarget: "Tuy ... nhưng ...",
        formula: [["tuy", "#c0392b"], ["Fact", "#e67e22"], ["nhưng", "#c0392b"], ["Contrast", "#27ae60"]],
        tip: "tuy (although) + fact, nhưng (but) + surprising result. Unlike English, Vietnamese happily uses both words in the same sentence.",
        examples: [
          { parts: [["Tuy", "Although", 0], ["phòng nhỏ,", "the room is small,", 1], ["nhưng", "-", 2], ["rất sạch.", "it's very clean.", 3]] },
          { parts: [["Tuy", "Although", 0], ["mệt,", "I was tired,", 1], ["nhưng", "-", 2], ["tôi vẫn đi làm.", "I still went to work.", 3]] },
          { parts: [["Tuy", "Although", 0], ["mắc,", "it's pricey,", 1], ["nhưng", "-", 2], ["rất ngon.", "it's delicious.", 3]] }
        ]
      },
      {
        name: "Condition with nếu ... thì",
        nameTarget: "Nếu ... thì ...",
        formula: [["nếu", "#c0392b"], ["Condition", "#e67e22"], ["thì", "#c0392b"], ["Result", "#27ae60"]],
        tip: "nếu (if) + condition, thì (then) + result. Vietnamese keeps thì even where English would drop 'then'.",
        examples: [
          { parts: [["Nếu", "If", 0], ["trời mưa", "it rains", 1], ["thì", "then", 2], ["tụi mình ở nhà.", "we'll stay home.", 3]] },
          { parts: [["Nếu", "If", 0], ["con không biết", "you don't know", 1], ["thì", "then", 2], ["cứ nói thật.", "just say so.", 3]] },
          { parts: [["Nếu", "If", 0], ["được", "I could", 1], ["thì", "then", 2], ["tui sống ở đây luôn.", "I'd live here for good.", 3]] }
        ]
      }
    ]
  }
];
