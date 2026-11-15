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
  },
  {
    level: "B1",
    title: "Intermediate",
    subtitle: "Shades of Meaning",
    icon: "Leo",
    description: "Say whether something happened to you for better or worse, describe change, do two things at once, and explain why.",
    patterns: [
      {
        name: "Passive with bị / được",
        nameTarget: "Bị và được",
        formula: [["Receiver", "#27ae60"], ["bị / được", "#c0392b"], ["(Agent)", "#8e44ad"], ["Verb", "#2980b9"]],
        tip: "The Vietnamese passive shows how the speaker feels about it: bị for bad outcomes (Tôi bị mất ví — my wallet got stolen), được for good ones (Tôi được khen — I got praised). The doer can come right after: Tôi bị má la.",
        examples: [
          { parts: [["Tôi", "I", 0], ["bị", "got (bad)", 1], ["má", "by Mom", 2], ["la.", "scolded.", 3]] },
          { parts: [["Em", "I", 0], ["được", "got (good)", 1], ["cô giáo", "by the teacher", 2], ["khen.", "praised.", 3]] },
          { parts: [["Xe hoa", "The flower cart", 0], ["bị", "was (bad)", 1], ["ai đó", "by someone", 2], ["đập phá.", "smashed.", 3]] }
        ]
      },
      {
        name: "More and More",
        nameTarget: "Càng ngày càng",
        formula: [["Subject", "#27ae60"], ["càng ngày càng", "#c0392b"], ["Adjective", "#2980b9"]],
        tip: "càng ngày càng + adjective = more and more each day. For 'the more... the more', use càng A càng B: Càng học càng thích.",
        examples: [
          { parts: [["Sài Gòn", "Saigon", 0], ["càng ngày càng", "is getting more and more", 1], ["đông.", "crowded.", 2]] },
          { parts: [["Tiếng Việt của tôi", "My Vietnamese", 0], ["càng ngày càng", "is getting", 1], ["tốt hơn.", "better and better.", 2]] },
          { parts: [["Trời", "It", 0], ["càng ngày càng", "is getting", 1], ["nóng.", "hotter and hotter.", 2]] }
        ]
      },
      {
        name: "At the Same Time with vừa ... vừa",
        nameTarget: "Vừa ... vừa ...",
        formula: [["vừa", "#c0392b"], ["A", "#2980b9"], ["vừa", "#c0392b"], ["B", "#e67e22"]],
        tip: "vừa A vừa B = doing A and B at the same time, or being both A and B: Quán này vừa rẻ vừa ngon.",
        examples: [
          { parts: [["Tụi nhỏ", "The kids", -1], ["vừa", "while", 0], ["chèo", "paddling", 1], ["vừa", "-", 2], ["hát.", "sing.", 3]] },
          { parts: [["Quán này", "This place is", -1], ["vừa", "both", 0], ["rẻ", "cheap", 1], ["vừa", "and", 2], ["ngon.", "tasty.", 3]] },
          { parts: [["Má", "Mom was", -1], ["vừa", "at once", 0], ["giận", "angry", 1], ["vừa", "and", 2], ["mừng.", "relieved.", 3]] }
        ]
      },
      {
        name: "Just / Only Then with mới",
        nameTarget: "Mới",
        formula: [["Subject / Time", "#27ae60"], ["mới", "#c0392b"], ["Verb", "#2980b9"]],
        tip: "mới before a verb can mean 'just (recently)': Tôi mới về. After a time phrase it means 'only then / not until': Mười giờ tôi mới đi ngủ = I didn't go to bed until ten.",
        examples: [
          { parts: [["Tôi", "I", 0], ["mới", "just", 1], ["về tới nhà.", "got home.", 2]] },
          { parts: [["Lúc đó tôi", "Only then did I", 0], ["mới", "(only then)", 1], ["hiểu.", "understand.", 2]] },
          { parts: [["Mười giờ tôi", "Not until ten did I", 0], ["mới", "(not until)", 1], ["đi ngủ.", "go to bed.", 2]] }
        ]
      },
      {
        name: "For / To Someone with cho",
        nameTarget: "Cho: làm cho ai",
        formula: [["Verb", "#2980b9"], ["cho", "#c0392b"], ["Person", "#27ae60"]],
        tip: "Verb + cho + person = do something for or to someone: mua cho má, kể cho tôi nghe. làm cho = make someone feel or do something: Bài hát làm cho bà khóc.",
        examples: [
          { parts: [["Tôi mua", "I bought", 0], ["cho", "for", 1], ["má", "Mom", 2], ["một cái áo len.", "a sweater.", -1]] },
          { parts: [["Ông kể", "Grandpa told", 0], ["cho", "(to)", 1], ["tụi tôi", "us", 2], ["nghe chuyện cũ.", "old stories.", -1]] },
          { parts: [["Bài hát", "The song", -1], ["làm", "made", 0], ["cho", "(cause)", 1], ["bà", "Grandma", 2], ["khóc.", "cry.", -1]] }
        ]
      },
      {
        name: "Purpose with để",
        nameTarget: "Để: mục đích",
        formula: [["Action", "#2980b9"], ["để", "#c0392b"], ["Purpose", "#e67e22"]],
        tip: "để = in order to. Put the action first, then để and the purpose: Tôi học tiếng Việt để nói chuyện với bạn bè.",
        examples: [
          { parts: [["Tôi học tiếng Việt", "I study Vietnamese", 0], ["để", "to", 1], ["nói chuyện với bạn bè.", "talk with my friends.", 2]] },
          { parts: [["Bà dành dụm tiền", "She saved money", 0], ["để", "to", 1], ["chuộc lại mặt dây chuyền.", "buy back the pendant.", 2]] },
          { parts: [["Thy ghi âm", "Thy recorded him", 0], ["để", "so as to", 1], ["giữ lại những câu chuyện.", "keep the stories.", 2]] }
        ]
      }
    ]
  },
  {
    level: "B1+",
    title: "Advanced",
    subtitle: "Natural, Expressive Speech",
    icon: "Cao",
    description: "Add emphasis and conditions, and master the little particles that make Southern speech sound warm and natural.",
    patterns: [
      {
        name: "Not Only ... But Also",
        nameTarget: "Không những ... mà còn",
        formula: [["không những", "#c0392b"], ["A", "#e67e22"], ["mà còn", "#c0392b"], ["B", "#27ae60"]],
        tip: "không những A mà còn B = not only A but also B. In speech you'll also hear không chỉ ... mà còn.",
        examples: [
          { parts: [["Quán này", "This place", -1], ["không những", "not only", 0], ["rẻ", "is cheap", 1], ["mà còn", "but also", 2], ["ngon.", "tasty.", 3]] },
          { parts: [["Ông", "He", -1], ["không những", "not only", 0], ["chở tôi", "gives me rides", 1], ["mà còn", "but also", 2], ["hỏi thăm tôi.", "asks after me.", 3]] },
          { parts: [["Bà", "She", -1], ["không những", "not only", 0], ["bán hoa", "sells flowers", 1], ["mà còn", "but also", 2], ["vẽ rất đẹp.", "draws beautifully.", 3]] }
        ]
      },
      {
        name: "Even with ngay cả ... cũng",
        nameTarget: "Ngay cả ... cũng",
        formula: [["ngay cả", "#c0392b"], ["Unexpected X", "#e67e22"], ["cũng", "#c0392b"], ["Verb", "#2980b9"]],
        tip: "ngay cả X cũng ... = even X ... — use it when X is the least expected case. Southern speakers also say tới X cũng: Tới má tôi cũng không biết.",
        examples: [
          { parts: [["Ngay cả", "Even", 0], ["ông Sáu", "Mr. Sáu", 1], ["cũng", "(too)", 2], ["thua.", "lost.", 3]] },
          { parts: [["Ngay cả", "Even", 0], ["tôi", "I", 1], ["cũng", "(too)", 2], ["không biết.", "didn't know.", 3]] },
          { parts: [["Ngay cả", "Even", 0], ["bác sĩ", "the doctor", 1], ["cũng", "(too)", 2], ["ngạc nhiên.", "was surprised.", 3]] }
        ]
      },
      {
        name: "Apart From with ngoài ... ra",
        nameTarget: "Ngoài ... ra",
        formula: [["ngoài", "#c0392b"], ["X", "#e67e22"], ["ra", "#c0392b"], ["Rest of sentence", "#27ae60"]],
        tip: "ngoài X ra = apart from X / besides X. It's often followed by còn (also) or chỉ có (only).",
        examples: [
          { parts: [["Ngoài", "Apart from", 0], ["ông", "him", 1], ["ra,", "-", 2], ["chỉ có chị Mai có chìa khóa.", "only Mai has a key.", 3]] },
          { parts: [["Ngoài", "Besides", 0], ["phở", "phở", 1], ["ra,", "-", 2], ["tôi còn thích hủ tiếu.", "I also like hủ tiếu.", 3]] },
          { parts: [["Ngoài", "Apart from", 0], ["tiếng gió", "the wind", 1], ["ra,", "-", 2], ["không có tiếng gì.", "there was no sound.", 3]] }
        ]
      },
      {
        name: "Emphasis with chính",
        nameTarget: "Chính",
        formula: [["chính", "#c0392b"], ["Noun", "#e67e22"], ["là", "#8e44ad"], ["Rest", "#27ae60"]],
        tip: "chính = 'the very / none other than / it was X who'. Chính bà Lựu là bà cố tôi = Mrs. Lựu was none other than my great-grandmother. chính mình = oneself.",
        examples: [
          { parts: [["Chính", "None other than", 0], ["bà Lựu", "Mrs. Lựu", 1], ["là", "was", 2], ["bà cố tôi.", "my great-grandmother.", 3]] },
          { parts: [["Chính", "It was", 0], ["tôi", "I", 1], ["là", "(who)", 2], ["người làm rơi nó.", "dropped it.", 3]] },
          { parts: [["Cô ấy làm việc ở", "She works at", -1], ["chính", "the very", 0], ["bệnh viện đó.", "hospital.", 1]] }
        ]
      },
      {
        name: "As Long As with miễn là",
        nameTarget: "Miễn là",
        formula: [["Result", "#27ae60"], ["miễn là", "#c0392b"], ["Condition", "#e67e22"]],
        tip: "miễn là = as long as / provided that. It usually comes after the main clause: Thua cũng được, miễn là con đánh thật.",
        examples: [
          { parts: [["Thua cũng được,", "It's fine to lose,", 0], ["miễn là", "as long as", 1], ["con đánh thật.", "you play for real.", 2]] },
          { parts: [["Hiểu lầm cũng không sao,", "Misunderstandings are fine,", 0], ["miễn là", "as long as", 1], ["mình biết hỏi.", "we ask.", 2]] },
          { parts: [["Đi đâu cũng được,", "We can go anywhere,", 0], ["miễn là", "as long as", 1], ["có ông đi cùng.", "you come along.", 2]] }
        ]
      },
      {
        name: "Sentence-Final Particles",
        nameTarget: "Nha, nhé, mà, đâu, chứ",
        formula: [["Sentence", "#27ae60"], ["Particle", "#c0392b"]],
        tip: "Final particles add feeling. nha (Southern) and nhé (Northern) soften a request: Ông chạy chậm thôi nha. mà insists: Con biết rồi mà. đâu strengthens a negative: Không sao đâu. chứ means 'of course': Có chứ!",
        examples: [
          { parts: [["Ông chạy chậm thôi", "Ride slowly", 0], ["nha.", "okay?", 1]] },
          { parts: [["Con biết rồi", "I know", 0], ["mà.", "(I really do!)", 1]] },
          { parts: [["Không sao", "It's nothing", 0], ["đâu.", "(at all).", 1]] }
        ]
      }
    ]
  }
];
