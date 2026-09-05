export type SessionKind = 'study' | 'check' | 'exam' | 'diagnostic' | 'rest'

/** Ссылка на материал занятия: видео с объяснением темы */
export interface SessionLink {
  label: string
  url: string
}

export interface Session {
  id: string
  /** ISO-дата занятия */
  date: string
  kind: SessionKind
  title: string
  /** Минуты: 60 обычное занятие, 40 диагностика, 90 экзамен, 15 мини-проверка, 0 отдых */
  minutes: number
  /** Одна строка пояснения, выводится серым под названием */
  notes?: string
  /** Что открыть на этом занятии */
  links?: SessionLink[]
  /** Темы программы (1–24), которые закрывает занятие */
  topics?: number[]
  /** «Рассматриваемые вопросы» из рабочей программы — дословно */
  questions?: string[]
}

export type BlockId = 'A' | 'B' | 'C'

export interface Week {
  n: number
  from: string
  to: string
  block: BlockId
  focus: string
  sessions: Session[]
  /** Пометка на карточке недели (например, «только повтор по журналу ошибок») */
  note?: string
}

export interface Block {
  id: BlockId
  title: string
  /** Плановые часы блока (для подписи; фактические суммы считаются из занятий) */
  hours: number
  weeks: number[]
}

/** Дата возвращения из академотпуска */
export const RETURN_DATE = '2027-02-09'
/** Конец основного плана (недели 1–12) */
export const CORE_END = '2026-11-22'
/** Порог сдачи любой проверки, % */
export const PASS_THRESHOLD = 80
/** Плановый объём по хендоффу: блок A ≈ 16 ч + блок B ≈ 54 ч */
export const PLANNED_HOURS = 70

export const BLOCKS: Block[] = [
  {
    id: 'A',
    title: 'Разница — то, чего не спрашивали на зачёте в декабре 2025',
    hours: 16,
    weeks: [1, 2, 3],
  },
  {
    id: 'B',
    title: 'Повторение сданного',
    hours: 54,
    weeks: [4, 5, 6, 7, 8, 9, 10, 11, 12],
  },
  {
    id: 'C',
    title: 'Резерв',
    hours: 5,
    weeks: [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
  },
]

const CORE_WEEKS: Week[] = [
  {
    n: 1,
    from: '2026-08-31',
    to: '2026-09-06',
    block: 'A',
    focus: 'Матрицы и определители',
    sessions: [
      {
        id: 'w01-d3',
        date: '2026-09-02',
        kind: 'diagnostic',
        title: 'Диагностика: по одной задаче из каждого блока',
        minutes: 40,
        notes: 'СЛАУ, векторы, прямая/плоскость, предел, производная, исследование функции. Без конспекта. Результат — на странице проверок.',
      },
      {
        id: 'w01-d4',
        date: '2026-09-03',
        kind: 'study',
        title: 'Операции над матрицами; определители 2-го и 3-го порядка (правило треугольника, разложение по строке)',
        minutes: 60,
        topics: [1, 2],
        questions: ['понятие матрицы, виды матриц', 'операции над матрицами, cвойства операций над матрицами', 'определитель квадратной матрицы', 'минор и алгебраическое дополнение элемента определителя', 'вычисление определителей'],
        links: [{ label: 'YouTube · Математик МГУ: матрицы и определители', url: 'https://www.youtube.com/watch?v=S6yg8N0VWAY' }, { label: 'YouTube · Валерий Волков: 5 способов определителя', url: 'https://www.youtube.com/watch?v=-7Muy9rU7wo' }],
      },
      {
        id: 'w01-d5',
        date: '2026-09-04',
        kind: 'study',
        title: 'Определители 4-го порядка (разложение, приведение к треугольному виду); свойства определителей',
        minutes: 60,
        topics: [2],
        questions: ['понятие определителя, свойства определителей'],
        links: [{ label: 'YouTube · Валерий Волков: определитель 4-го порядка', url: 'https://www.youtube.com/watch?v=w_MxAwR3I8g' }, { label: 'YouTube · Видеокурсы DA VINCI: свойства определителей', url: 'https://www.youtube.com/watch?v=d6fJbE-eTHU' }],
      },
      {
        id: 'w01-d6',
        date: '2026-09-05',
        kind: 'study',
        title: 'Обратная матрица через алгебраические дополнения; матричный метод решения СЛАУ',
        minutes: 60,
        topics: [3],
        questions: ['обратная матрица и её свойства'],
        links: [{ label: 'YouTube · Валерий Волков: обратная матрица (2 способа)', url: 'https://www.youtube.com/watch?v=6Osv_KleQr0' }, { label: 'YouTube · Валерий Волков: матричный метод решения СЛАУ', url: 'https://www.youtube.com/watch?v=AWrczMDGTac' }],
      },
    ],
  },
  {
    n: 2,
    from: '2026-09-07',
    to: '2026-09-13',
    block: 'A',
    focus: 'Матрицы (доб.) и векторная алгебра',
    sessions: [
      {
        id: 'w02-d1',
        date: '2026-09-07',
        kind: 'study',
        title: 'Ранг матрицы, элементарные преобразования; матричные уравнения AX = B',
        minutes: 60,
        topics: [4],
        questions: ['ранг матрицы', 'элементарные преобразования матриц'],
        links: [{ label: 'YouTube · Валерий Волков: ранг матрицы', url: 'https://www.youtube.com/watch?v=Uy-bqENs1pI' }, { label: 'YouTube · Валерий Волков: матричные уравнения', url: 'https://www.youtube.com/watch?v=gPhhN2mmggg' }],
      },
      {
        id: 'w02-d2',
        date: '2026-09-08',
        kind: 'study',
        title: 'Векторы: линейные операции, линейная зависимость, базис, координаты, коллинеарность',
        minutes: 60,
        topics: [5],
        questions: ['понятие векторы, действия над векторами', 'линейная зависимость векторов', 'базис на прямой, на плоскости и в пространстве', 'координаты вектора в заданном базисе', 'линейные операции над векторами в координатной форме'],
        links: [{ label: 'YouTube · Дистанционные занятия МФТИ: линейная зависимость, базис', url: 'https://www.youtube.com/watch?v=OnlyCNrSH3I' }, { label: 'YouTube · Валерий Волков: разложение по базису', url: 'https://www.youtube.com/watch?v=2JCnorkoPOw' }],
      },
      {
        id: 'w02-d3',
        date: '2026-09-09',
        kind: 'study',
        title: 'Скалярное произведение: длина, угол, проекция, ортогональность',
        minutes: 60,
        topics: [6],
        questions: ['скалярное произведение двух векторов, его алгебраические свойства', 'применение скалярного произведения к решению задач'],
        links: [{ label: 'YouTube · Валерий Волков: скалярное произведение', url: 'https://www.youtube.com/watch?v=HmtZxlcQRJ8' }, { label: 'YouTube · Mathematical Center in Akademgorodok: скалярное произведение, свойства', url: 'https://www.youtube.com/watch?v=nrtJy8D_mkg' }, { label: 'YouTube · Ульяна Половинкина: угол между векторами и проекция на примерах', url: 'https://www.youtube.com/watch?v=fTSpT35ryNM' }],
      },
      {
        id: 'w02-d4',
        date: '2026-09-10',
        kind: 'study',
        title: 'Векторное произведение: площадь параллелограмма и треугольника, свойства',
        minutes: 60,
        topics: [7],
        questions: ['векторное произведение двух векторов, его геометрический и механический смысл алгебраические свойства векторного произведения', 'вычисление векторного произведения в ортонормированном базисе'],
        links: [{ label: 'YouTube · Mathematical Center in Akademgorodok: векторное произведение, свойства', url: 'https://www.youtube.com/watch?v=kH4PiNIGv4I' }, { label: 'YouTube · Валерий Волков: векторное произведение', url: 'https://www.youtube.com/watch?v=gJlNmmhj2qY' }],
      },
      {
        id: 'w02-d5',
        date: '2026-09-11',
        kind: 'study',
        title: 'Смешанное произведение: объём параллелепипеда и тетраэдра, компланарность',
        minutes: 60,
        topics: [7],
        questions: ['смешанное произведение векторов, его геометрический смысл', 'алгебраические свойства смешанного произведения', 'вычисление смешанного произведения в ортонормированном базисе', 'условие компланарности трех векторов', 'вычисление длины отрезка, площадей параллелограмма и треугольника, объемов параллелепипеда и тетраэдра'],
        links: [{ label: 'YouTube · Mathematical Center in Akademgorodok: смешанное произведение, свойства', url: 'https://www.youtube.com/watch?v=xKxNogx7pJI' }, { label: 'YouTube · Ульяна Половинкина: объём через смешанное произведение', url: 'https://www.youtube.com/watch?v=xtTBTWIRCzY' }],
      },
      {
        id: 'w02-d6',
        date: '2026-09-12',
        kind: 'check',
        title: 'Проверка №1: матрицы + векторы',
        minutes: 60,
      },
    ],
  },
  {
    n: 3,
    from: '2026-09-14',
    to: '2026-09-20',
    block: 'A',
    focus: 'Кривые 2-го порядка, Лопиталь, высшие порядки',
    sessions: [
      {
        id: 'w03-d1',
        date: '2026-09-14',
        kind: 'study',
        title: 'Эллипс, гипербола, парабола: канонические уравнения, параметры, эксцентриситет, директрисы, построение',
        minutes: 60,
        topics: [11],
        questions: ['эллипс, гипербола, парабола и их геометрические свойства'],
        links: [{ label: 'YouTube · Математик МГУ: эллипс, гипербола, парабола', url: 'https://www.youtube.com/watch?v=qbGg3-kgSMA' }, { label: 'YouTube · Teach-in: Овчинников, лекция 8', url: 'https://www.youtube.com/watch?v=vaA21czIyIw' }],
      },
      {
        id: 'w03-d2',
        date: '2026-09-15',
        kind: 'study',
        title: 'Общее уравнение линии 2-го порядка → каноническое (выделение полных квадратов), построение',
        minutes: 60,
        topics: [11],
        questions: ['общее уравнение линии второго порядка на плоскости'],
        links: [{ label: 'YouTube · Мемория Высшая Математика: §31.1 к каноническому виду (параллельный перенос, полные квадраты)', url: 'https://www.youtube.com/watch?v=aso0L7l8qyQ' }, { label: 'YouTube · Михаил Рыбков: эллипс, канонический вид, чертёж', url: 'https://www.youtube.com/watch?v=Vg_ZrBIH4NY' }],
      },
      {
        id: 'w03-d3',
        date: '2026-09-16',
        kind: 'study',
        title: 'Правило Лопиталя: 0/0, ∞/∞; сведение 0·∞, ∞−∞, 1^∞; когда не работает',
        minutes: 60,
        topics: [24],
        questions: ['правило Лопиталя'],
        links: [{ label: 'YouTube · Борис Трушин: правило Лопиталя (0/0, ∞/∞, условия)', url: 'https://www.youtube.com/watch?v=k-GRSf_8u3Y' }, { label: 'YouTube · N Eliseeva: сведение 0·∞, ∞−∞, 1^∞', url: 'https://www.youtube.com/watch?v=uV4JZQs9D-k' }, { label: 'YouTube · N Eliseeva: когда нельзя применять правило Лопиталя', url: 'https://www.youtube.com/watch?v=lJmJ36JRLKA' }],
      },
      {
        id: 'w03-d4',
        date: '2026-09-17',
        kind: 'study',
        title: 'Производная параметрически заданной функции (включая y″); производные высших порядков, n-я производная',
        minutes: 60,
        topics: [21],
        questions: ['дифференцирование функции заданной в параметрической форме', 'производные высших порядков'],
        links: [{ label: 'YouTube · Валерий Волков: параметрическая функция, y′ и y″', url: 'https://www.youtube.com/watch?v=TZfAmS9eRFM' }, { label: 'YouTube · Валерий Волков: производные высших порядков', url: 'https://www.youtube.com/watch?v=laTXfQMGDUI' }],
      },
      {
        id: 'w03-d5',
        date: '2026-09-18',
        kind: 'study',
        title: 'Дифференциал, приближённые вычисления, дифференциалы высших порядков; производная обратной функции',
        minutes: 60,
        topics: [22],
        questions: ['дифференциал функции', 'применение дифференциалов к приближенным вычислениям', 'дифференциалы высших порядков'],
        links: [{ label: 'YouTube · Валерий Волков: дифференциал функции', url: 'https://www.youtube.com/watch?v=WKZzfpGiHK4' }, { label: 'YouTube · Валерий Волков: приближённые вычисления', url: 'https://www.youtube.com/watch?v=euQUHSgcuHE' }, { label: 'YouTube · Валерий Волков: производная обратной функции', url: 'https://www.youtube.com/watch?v=hzNQ7j8GfmU' }],
      },
      {
        id: 'w03-d6',
        date: '2026-09-19',
        kind: 'check',
        title: 'Проверка №2: кривые, Лопиталь, параметрические, высшие порядки',
        minutes: 60,
        notes: 'Закрывает блок А.',
      },
    ],
  },
  {
    n: 4,
    from: '2026-09-21',
    to: '2026-09-27',
    block: 'B',
    focus: 'СЛАУ и прямая на плоскости',
    sessions: [
      {
        id: 'w04-d1',
        date: '2026-09-21',
        kind: 'study',
        title: 'СЛАУ методом Крамера (3×3), условие единственности решения',
        minutes: 60,
        topics: [3],
        questions: ['понятие системы линейных уравнений порядка n', 'решение СЛАУ методом Крамера'],
        links: [{ label: 'YouTube · Валерий Волков: формулы Крамера 3×3', url: 'https://www.youtube.com/watch?v=jWFt1d5XpoQ' }],
      },
      {
        id: 'w04-d2',
        date: '2026-09-22',
        kind: 'study',
        title: 'СЛАУ методом Гаусса: несовместные системы и системы с бесконечным числом решений (общее решение)',
        minutes: 60,
        topics: [4],
        questions: ['решение СЛАУ методом Гаусса'],
        links: [{ label: 'YouTube · N Eliseeva: Гаусс, несовместная система', url: 'https://www.youtube.com/watch?v=j5TTx5HlKrI' }, { label: 'YouTube · N Eliseeva: Гаусс, общее решение', url: 'https://www.youtube.com/watch?v=geho9yQ8xCw' }],
      },
      {
        id: 'w04-d3',
        date: '2026-09-23',
        kind: 'study',
        title: 'Прямая на плоскости: общее уравнение, с угловым коэффициентом, через две точки, каноническое, параметрическое, в отрезках',
        minutes: 60,
        topics: [8],
        questions: ['способы задания уравнения прямой на плоскости'],
        links: [{ label: 'YouTube · Mathematical Center in Akademgorodok: виды уравнений прямой', url: 'https://www.youtube.com/watch?v=UW3BkIRuoD4' }],
      },
      {
        id: 'w04-d4',
        date: '2026-09-24',
        kind: 'study',
        title: 'Взаимное расположение прямых, угол, параллельность/перпендикулярность, расстояние от точки до прямой',
        minutes: 60,
        topics: [8],
        questions: ['взаимное расположение прямых на плоскости', 'расстояние от точки до прямой'],
        links: [{ label: 'YouTube · Мемория Высшая Математика: угол между прямыми', url: 'https://www.youtube.com/watch?v=7gQ2IVAgVkA' }, { label: 'YouTube · Валерий Волков: расстояние до прямой', url: 'https://www.youtube.com/watch?v=JWfwRQ7cko4' }],
      },
      {
        id: 'w04-d5',
        date: '2026-09-25',
        kind: 'study',
        title: 'Треугольник по координатам вершин: стороны, высота, медиана, углы, площадь',
        minutes: 60,
        links: [{ label: 'YouTube · МатФак: треугольник по вершинам', url: 'https://www.youtube.com/watch?v=UCEQPcxyVeg' }, { label: 'YouTube · Данил Лебедев: стороны, высота, площадь', url: 'https://www.youtube.com/watch?v=b8KCfmhdEwI' }],
      },
      {
        id: 'w04-d6',
        date: '2026-09-26',
        kind: 'check',
        title: 'Проверка №3: СЛАУ + прямая на плоскости',
        minutes: 60,
      },
    ],
  },
  {
    n: 5,
    from: '2026-09-28',
    to: '2026-10-04',
    block: 'B',
    focus: 'Прямая и плоскость в пространстве',
    sessions: [
      {
        id: 'w05-d1',
        date: '2026-09-28',
        kind: 'study',
        title: 'Плоскость: общее уравнение, через точку и нормаль, через три точки, в отрезках; взаимное расположение плоскостей, угол',
        minutes: 60,
        topics: [10],
        questions: ['уравнения плоскостей'],
        links: [{ label: 'YouTube · Mathematical Center in Akademgorodok: виды уравнений плоскости', url: 'https://www.youtube.com/watch?v=Ko1GJgrc0LE' }, { label: 'YouTube · N Eliseeva: угол между плоскостями', url: 'https://www.youtube.com/watch?v=vVY5YQ6qr_8' }],
      },
      {
        id: 'w05-d2',
        date: '2026-09-29',
        kind: 'study',
        title: 'Прямая в пространстве: канонические и параметрические уравнения, прямая как пересечение плоскостей; угол между прямыми',
        minutes: 60,
        topics: [9],
        questions: ['способы задания уравнения прямой в пространстве', 'взаимное расположение прямых в пространстве', 'угол между двумя прямыми в пространстве'],
        links: [{ label: 'YouTube · N Eliseeva: прямая в пространстве', url: 'https://www.youtube.com/watch?v=Yr_5FJChGJc' }, { label: 'YouTube · N Eliseeva: прямая как пересечение плоскостей', url: 'https://www.youtube.com/watch?v=2XvKVOwHJ9o' }],
      },
      {
        id: 'w05-d3',
        date: '2026-09-30',
        kind: 'study',
        title: 'Прямая и плоскость: угол, точка пересечения, параллельность/перпендикулярность',
        minutes: 60,
        topics: [10],
        questions: ['взаимное расположение прямых и плоскостей', 'угол между прямой и плоскостью'],
        links: [{ label: 'YouTube · N Eliseeva: угол между прямой и плоскостью', url: 'https://www.youtube.com/watch?v=V8NrBTKUask' }, { label: 'YouTube · N Eliseeva: прямая и плоскость, расположение', url: 'https://www.youtube.com/watch?v=JsUOL8vSQa4' }],
      },
      {
        id: 'w05-d4',
        date: '2026-10-01',
        kind: 'study',
        title: 'Расстояния: от точки до плоскости, от точки до прямой',
        minutes: 60,
        topics: [10],
        questions: ['расстояние от точки до плоскости'],
        links: [{ label: 'YouTube · N Eliseeva: расстояние до плоскости', url: 'https://www.youtube.com/watch?v=xJF0eQ_ZJb8' }, { label: 'YouTube · N Eliseeva: расстояние до прямой в пространстве', url: 'https://www.youtube.com/watch?v=ejlO3SosnOk' }],
      },
      {
        id: 'w05-d5',
        date: '2026-10-02',
        kind: 'study',
        title: 'Смешанные задачи по всей аналитической геометрии',
        minutes: 60,
      },
      {
        id: 'w05-d6',
        date: '2026-10-03',
        kind: 'exam',
        title: 'Пробный экзамен №1: алгебра + геометрия',
        minutes: 90,
        notes: 'Билет: 2 теоретических вопроса + 4 задачи.',
      },
    ],
  },
  {
    n: 6,
    from: '2026-10-05',
    to: '2026-10-11',
    block: 'B',
    focus: 'Пределы, часть 1',
    sessions: [
      {
        id: 'w06-d1',
        date: '2026-10-05',
        kind: 'study',
        title: 'Функции: область определения, чётность, основные элементарные функции и их графики; обратная и сложная функция',
        minutes: 60,
        topics: [12],
        questions: ['понятие функции и способы её задания', 'числовые функции, график функции, способы задания', 'обратная функция, сложная функция, основные элементарные функции их свойства и графики'],
        links: [{ label: 'YouTube · Видеоуроки математики: область определения функции (матанализ #4)', url: 'https://www.youtube.com/watch?v=yOfQMvzv1ms' }, { label: 'YouTube · Борис Трушин: обратная функция (матан #024)', url: 'https://www.youtube.com/watch?v=LQZa7vPkqqc' }],
      },
      {
        id: 'w06-d2',
        date: '2026-10-06',
        kind: 'study',
        title: 'Последовательности, предел последовательности, свойства; верхняя и нижняя грани множества',
        minutes: 60,
        topics: [13],
        questions: ['числовые последовательности', 'предел последовательности'],
        links: [{ label: 'YouTube · Борис Трушин: предел последовательности', url: 'https://www.youtube.com/watch?v=ZmwdHAhVsPM' }, { label: 'YouTube · Борис Трушин: супремум и инфимум', url: 'https://www.youtube.com/watch?v=JlL-Tno5zvA' }],
      },
      {
        id: 'w06-d3',
        date: '2026-10-07',
        kind: 'study',
        title: 'Предел функции в точке, односторонние пределы, предел на бесконечности; бесконечно большие и бесконечно малые',
        minutes: 60,
        topics: [14, 15],
        questions: ['предел функции в точке', 'односторонние пределы', 'предел функции при x → ∞', 'бесконечно большие функции', 'бесконечно малые функции', 'связь между функцией, ее пределом и б.м. функцией', 'основные теоремы о пределах'],
        links: [{ label: 'YouTube · Борис Трушин: предел функции (по Коши и по Гейне)', url: 'https://www.youtube.com/watch?v=UzfAt6DoN3E' }, { label: 'YouTube · Борис Трушин: бесконечно малые и бесконечно большие функции', url: 'https://www.youtube.com/watch?v=L1Qn2LEweeI' }],
      },
      {
        id: 'w06-d4',
        date: '2026-10-08',
        kind: 'study',
        title: 'Неопределённости ∞/∞ и 0/0 с многочленами и корнями (деление на старшую степень, домножение на сопряжённое)',
        minutes: 60,
        links: [{ label: 'YouTube · Математикс: неопределённости 0/0 и ∞/∞', url: 'https://www.youtube.com/watch?v=HN5EBX8wb_o' }, { label: 'YouTube · N Eliseeva: 0/0 с корнями', url: 'https://www.youtube.com/watch?v=hc1J_TWKwzo' }],
      },
      {
        id: 'w06-d5',
        date: '2026-10-09',
        kind: 'study',
        title: 'Неопределённости ∞−∞ и 0·∞; замена переменной в пределах',
        minutes: 60,
        links: [{ label: 'YouTube · Валерий Волков: все виды неопределённостей', url: 'https://www.youtube.com/watch?v=XSN8LInRQVs' }, { label: 'YouTube · N Eliseeva: ∞−∞', url: 'https://www.youtube.com/watch?v=vRIqFX1BFSA' }, { label: 'YouTube · Другое Мнение: предел функции, метод замены', url: 'https://www.youtube.com/watch?v=nHdya_dOWto' }],
      },
      {
        id: 'w06-d6',
        date: '2026-10-10',
        kind: 'check',
        title: 'Проверка №4: пределы, часть 1',
        minutes: 60,
      },
    ],
  },
  {
    n: 7,
    from: '2026-10-12',
    to: '2026-10-18',
    block: 'B',
    focus: 'Пределы, часть 2',
    sessions: [
      {
        id: 'w07-d1',
        date: '2026-10-12',
        kind: 'study',
        title: 'Первый замечательный предел и следствия',
        minutes: 60,
        topics: [16],
        questions: ['первый замечательный предел'],
        links: [{ label: 'YouTube · Борис Трушин: первый замечательный предел (матан #028, сам предел с 21:44)', url: 'https://www.youtube.com/watch?v=DJN8jCmEYdE' }, { label: 'YouTube · Математик МГУ: первый и второй замечательные пределы', url: 'https://www.youtube.com/watch?v=u2o-Ll0tzMk' }],
      },
      {
        id: 'w07-d2',
        date: '2026-10-13',
        kind: 'study',
        title: 'Второй замечательный предел, неопределённость 1^∞',
        minutes: 60,
        topics: [16],
        questions: ['второй замечательный предел'],
        links: [{ label: 'YouTube · Борис Трушин: второй замечательный предел', url: 'https://www.youtube.com/watch?v=YzFKUOOGtgU' }, { label: 'YouTube · N Eliseeva: 1^∞ на примерах', url: 'https://www.youtube.com/watch?v=mc2MdJYn8ME' }],
      },
      {
        id: 'w07-d3',
        date: '2026-10-14',
        kind: 'study',
        title: 'Таблица эквивалентностей, вычисление пределов через эквивалентности',
        minutes: 60,
        topics: [16],
        questions: ['эквивалентные б.м. функции'],
        links: [{ label: 'YouTube · N Eliseeva: таблица эквивалентностей (вывод всех формул)', url: 'https://www.youtube.com/watch?v=dZnYYls2uwk' }, { label: 'YouTube · N Eliseeva: вычисление пределов через эквивалентности', url: 'https://www.youtube.com/watch?v=S5BVR8FBwNg' }],
      },
      {
        id: 'w07-d4',
        date: '2026-10-15',
        kind: 'study',
        title: 'Смешанные пределы; теория: свойства пределов, признаки существования предела',
        minutes: 60,
        topics: [15],
        questions: ['признаки существования пределов'],
        links: [{ label: 'YouTube · Борис Трушин: свойства пределов функции (матан #015)', url: 'https://www.youtube.com/watch?v=Nx2GqsolBQ0' }, { label: 'YouTube · Борис Трушин: теорема о двух милиционерах (матан #007)', url: 'https://www.youtube.com/watch?v=WTjfi-eqL7E' }, { label: 'YouTube · Борис Трушин: предел монотонной последовательности, теорема Вейерштрасса (матан #010)', url: 'https://www.youtube.com/watch?v=aL145agf47s' }],
      },
      {
        id: 'w07-d5',
        date: '2026-10-16',
        kind: 'study',
        title: 'Метод половинного деления (вопрос теории №11); повтор трудных пределов из журнала ошибок',
        minutes: 60,
        links: [{ label: 'YouTube · Данил Лебедев: метод половинного деления', url: 'https://www.youtube.com/watch?v=BaLwroc_cbY' }],
      },
      {
        id: 'w07-d6',
        date: '2026-10-17',
        kind: 'check',
        title: 'Проверка №5: пределы, часть 2',
        minutes: 60,
      },
    ],
  },
  {
    n: 8,
    from: '2026-10-19',
    to: '2026-10-25',
    block: 'B',
    focus: 'Непрерывность',
    sessions: [
      {
        id: 'w08-d1',
        date: '2026-10-19',
        kind: 'study',
        title: 'Определение непрерывности; теоремы о непрерывных функциях, в том числе на отрезке',
        minutes: 60,
        topics: [17],
        questions: ['непрерывные функции', 'основные теоремы о непрерывных функциях'],
        links: [{ label: 'YouTube · Борис Трушин: непрерывность в точке', url: 'https://www.youtube.com/watch?v=nXUEw07DWkw' }, { label: 'YouTube · Борис Трушин: теоремы Вейерштрасса и Коши', url: 'https://www.youtube.com/watch?v=V7bU_F2_bfQ' }],
      },
      {
        id: 'w08-d2',
        date: '2026-10-20',
        kind: 'study',
        title: 'Точки разрыва: устранимый, 1-го рода, 2-го рода; исследование функции на непрерывность',
        minutes: 60,
        topics: [17],
        questions: ['точки разрыва и их классификация'],
        links: [{ label: 'YouTube · Валерий Волков: точки разрыва', url: 'https://www.youtube.com/watch?v=SOOf13H1oHw' }, { label: 'YouTube · Борис Трушин: классификация разрывов', url: 'https://www.youtube.com/watch?v=mxP1Ig2Ejvw' }],
      },
      {
        id: 'w08-d3',
        date: '2026-10-21',
        kind: 'study',
        title: 'Кусочно-заданные функции; непрерывность с параметром',
        minutes: 60,
        links: [{ label: 'YouTube · Нина Икс: кусочно-заданная функция', url: 'https://www.youtube.com/watch?v=BSGP7UTf1_8' }, { label: 'YouTube · Точки Лагранжа: параметр и непрерывность', url: 'https://www.youtube.com/watch?v=tlrvtskxjhk' }],
      },
      {
        id: 'w08-d4',
        date: '2026-10-22',
        kind: 'study',
        title: 'Повтор всего блока пределов по журналу ошибок',
        minutes: 60,
      },
      {
        id: 'w08-d5',
        date: '2026-10-23',
        kind: 'study',
        title: 'Теория блока: вопросы 1–11 — проговорить вслух определения и формулировки',
        minutes: 60,
      },
      {
        id: 'w08-d6',
        date: '2026-10-24',
        kind: 'exam',
        title: 'Пробный экзамен №2: пределы + непрерывность',
        minutes: 90,
      },
    ],
  },
  {
    n: 9,
    from: '2026-10-26',
    to: '2026-11-01',
    block: 'B',
    focus: 'Производная, часть 1',
    sessions: [
      {
        id: 'w09-d1',
        date: '2026-10-26',
        kind: 'study',
        title: 'Определение производной; механический, геометрический и экономический смысл; касательная и нормаль',
        minutes: 60,
        topics: [18],
        questions: ['задачи, приводящие к понятию производной', 'определение производной, ее механический и геометрический смысл'],
        links: [{ label: 'YouTube · Борис Трушин: определение производной', url: 'https://www.youtube.com/watch?v=19H7-BBwMoQ' }, { label: 'YouTube · N Eliseeva: касательная и нормаль', url: 'https://www.youtube.com/watch?v=KLzq2TTZN34' }],
      },
      {
        id: 'w09-d2',
        date: '2026-10-27',
        kind: 'study',
        title: 'Правила дифференцирования (сумма, произведение, частное), таблица производных',
        minutes: 60,
        topics: [18, 19],
        questions: ['правила вычисления производной функции', 'производные основных элементарных функций', 'таблица производных'],
        links: [{ label: 'YouTube · Борис Трушин: правила дифференцирования', url: 'https://www.youtube.com/watch?v=9ch3wfuHYuE' }],
      },
      {
        id: 'w09-d3',
        date: '2026-10-28',
        kind: 'study',
        title: 'Производная сложной функции, многоуровневые композиции',
        minutes: 60,
        topics: [19],
        questions: ['производная сложной и обратной функций'],
        links: [{ label: 'YouTube · Борис Трушин: производная сложной функции', url: 'https://www.youtube.com/watch?v=SiTUVqIoO1o' }],
      },
      {
        id: 'w09-d4',
        date: '2026-10-29',
        kind: 'study',
        title: 'Производная обратной функции; дифференцируемость и непрерывность (вопрос теории №17)',
        minutes: 60,
        topics: [23],
        questions: ['некоторые теоремы о дифференцируемых функциях'],
        links: [{ label: 'YouTube · Борис Трушин: производная обратной функции', url: 'https://www.youtube.com/watch?v=qwofY4D96XA' }, { label: 'YouTube · Red Pen: дифференцируемость и непрерывность', url: 'https://www.youtube.com/watch?v=fzmnIRl6GbU' }],
      },
      {
        id: 'w09-d5',
        date: '2026-10-30',
        kind: 'study',
        title: 'Тренировка на скорость: 20 производных за 40 минут',
        minutes: 60,
      },
      {
        id: 'w09-d6',
        date: '2026-10-31',
        kind: 'check',
        title: 'Проверка №6: производная, часть 1',
        minutes: 60,
      },
    ],
  },
  {
    n: 10,
    from: '2026-11-02',
    to: '2026-11-08',
    block: 'B',
    focus: 'Производная, часть 2',
    sessions: [
      {
        id: 'w10-d1',
        date: '2026-11-02',
        kind: 'study',
        title: 'Логарифмическое дифференцирование, степенно-показательная функция',
        minutes: 60,
        topics: [20],
        questions: ['логарифмическое дифференцирование'],
        links: [{ label: 'YouTube · N Eliseeva: степенно-показательная функция', url: 'https://www.youtube.com/watch?v=6KTZMs5NM_c' }, { label: 'YouTube · Valery Volkov: два способа', url: 'https://www.youtube.com/watch?v=fGyGybCMhy4' }],
      },
      {
        id: 'w10-d2',
        date: '2026-11-03',
        kind: 'study',
        title: 'Производная неявной функции',
        minutes: 60,
        topics: [20],
        questions: ['производная неявной функции'],
        links: [{ label: 'YouTube · Valery Volkov: производная неявной функции', url: 'https://www.youtube.com/watch?v=KBhlEe3HpzY' }],
      },
      {
        id: 'w10-d3',
        date: '2026-11-04',
        kind: 'study',
        title: 'Параметрическая функция и производные высших порядков (повтор)',
        minutes: 60,
        links: [{ label: 'YouTube · Valery Volkov: производная параметрически заданной функции (1-й, 2-й, 3-й порядок)', url: 'https://www.youtube.com/watch?v=TZfAmS9eRFM' }, { label: 'YouTube · Борис Трушин: производные и дифференциалы высших порядков, формула Лейбница (матан #036)', url: 'https://www.youtube.com/watch?v=gfa9NLmrtuw' }],
      },
      {
        id: 'w10-d4',
        date: '2026-11-05',
        kind: 'study',
        title: 'Дифференциал: определение, геометрический смысл, приближённые вычисления',
        minutes: 60,
        links: [{ label: 'YouTube · Борис Трушин: дифференциал', url: 'https://www.youtube.com/watch?v=dx_GkybeWjA' }, { label: 'YouTube · N Eliseeva: приближённые вычисления', url: 'https://www.youtube.com/watch?v=8y2UlUJ_1eg' }],
      },
      {
        id: 'w10-d5',
        date: '2026-11-06',
        kind: 'study',
        title: 'Смешанные задачи по всей технике дифференцирования',
        minutes: 60,
      },
      {
        id: 'w10-d6',
        date: '2026-11-07',
        kind: 'check',
        title: 'Проверка №7: производная, часть 2',
        minutes: 60,
      },
    ],
  },
  {
    n: 11,
    from: '2026-11-09',
    to: '2026-11-15',
    block: 'B',
    focus: 'Теоремы о среднем, Лопиталь, экстремумы',
    sessions: [
      {
        id: 'w11-d1',
        date: '2026-11-09',
        kind: 'study',
        title: 'Теоремы Ферма, Ролля, Лагранжа, Коши: формулировки, условия, геометрический смысл; задачи на точку c',
        minutes: 60,
        links: [{ label: 'YouTube · Борис Трушин: теоремы о среднем', url: 'https://www.youtube.com/watch?v=np09VlUmQDc' }],
      },
      {
        id: 'w11-d2',
        date: '2026-11-10',
        kind: 'study',
        title: 'Правило Лопиталя (повтор), связь с теоремой Коши; сложные случаи',
        minutes: 60,
        links: [{ label: 'YouTube · Борис Трушин: правило Лопиталя', url: 'https://www.youtube.com/watch?v=k-GRSf_8u3Y' }, { label: 'YouTube · N Eliseeva: сложные неопределённости', url: 'https://www.youtube.com/watch?v=uV4JZQs9D-k' }],
      },
      {
        id: 'w11-d3',
        date: '2026-11-11',
        kind: 'study',
        title: 'Экстремум: необходимое и достаточное условия; интервалы монотонности',
        minutes: 60,
        links: [{ label: 'YouTube · Борис Трушин: монотонность и экстремумы', url: 'https://www.youtube.com/watch?v=IodqPbmO2eQ' }],
      },
      {
        id: 'w11-d4',
        date: '2026-11-12',
        kind: 'study',
        title: 'Выпуклость и точки перегиба (вторая производная)',
        minutes: 60,
        links: [{ label: 'YouTube · ИТМО, Правдин: выпуклость и перегибы', url: 'https://www.youtube.com/watch?v=H6_SbMi6_hg' }, { label: 'YouTube · Andrei Gradient: практика', url: 'https://www.youtube.com/watch?v=Okw0KbHttYk' }],
      },
      {
        id: 'w11-d5',
        date: '2026-11-13',
        kind: 'study',
        title: 'Асимптоты: вертикальные, горизонтальные, наклонные',
        minutes: 60,
        links: [{ label: 'YouTube · ИТМО, Правдин: асимптоты', url: 'https://www.youtube.com/watch?v=32Zju09K3VM' }, { label: 'YouTube · Татьяна Зыкова: асимптоты и схема исследования', url: 'https://www.youtube.com/watch?v=yGu1V1D61DQ' }],
      },
      {
        id: 'w11-d6',
        date: '2026-11-14',
        kind: 'check',
        title: 'Проверка №8: теоремы, экстремумы, выпуклость, асимптоты',
        minutes: 60,
      },
    ],
  },
  {
    n: 12,
    from: '2026-11-16',
    to: '2026-11-22',
    block: 'B',
    focus: 'Исследование функций и итог',
    sessions: [
      {
        id: 'w12-d1',
        date: '2026-11-16',
        kind: 'study',
        title: 'Полная схема исследования функции и построение графика (одна функция подробно)',
        minutes: 60,
        links: [{ label: 'YouTube · Valery Volkov: общая схема исследования', url: 'https://www.youtube.com/watch?v=cD0k3TNjgmM' }],
      },
      {
        id: 'w12-d2',
        date: '2026-11-17',
        kind: 'study',
        title: 'Ещё две функции по схеме: дробно-рациональная и с корнем/экспонентой',
        minutes: 60,
        links: [{ label: 'YouTube · Ильдар Калимуллин: дробно-рациональная', url: 'https://www.youtube.com/watch?v=9uUKVmWbigU' }, { label: 'YouTube · Ильдар Калимуллин: показательная', url: 'https://www.youtube.com/watch?v=Ak9KBthcv7M' }],
      },
      {
        id: 'w12-d3',
        date: '2026-11-18',
        kind: 'study',
        title: 'Теория блока производных: вопросы 12–23 — проговорить вслух',
        minutes: 60,
      },
      {
        id: 'w12-d4',
        date: '2026-11-19',
        kind: 'study',
        title: 'Сквозной повтор по журналу ошибок (все блоки)',
        minutes: 60,
      },
      {
        id: 'w12-d5',
        date: '2026-11-20',
        kind: 'study',
        title: 'Разбор ошибок пробных экзаменов №1–2',
        minutes: 60,
      },
      {
        id: 'w12-d6',
        date: '2026-11-21',
        kind: 'exam',
        title: 'Пробный экзамен №3: весь семестр (билет)',
        minutes: 90,
      },
    ],
  },
]

/** Субботние мини-проверки резерва: 15 минут, 3 задачи по темам 1–24 вразброс */
export const MINI_CHECK_DATES = [
  '2026-11-28',
  '2026-12-05',
  '2026-12-12',
  '2026-12-26',
  '2027-01-09',
  '2027-01-16',
  '2027-01-23',
  '2027-02-06',
]

export function miniCheckId(date: string): string {
  return `mini-${date}`
}

/** Фиксированные события резерва, привязанные к неделям 13–23 */
const RESERVE_FIXED: Record<number, Session[]> = {
  16: [
    {
      id: 'exam-04',
      date: '2026-12-19',
      kind: 'exam',
      title: 'Пробный экзамен №4: весь семестр',
      minutes: 90,
    },
  ],
  18: [
    {
      id: 'rest-ny',
      date: '2026-12-31',
      kind: 'rest',
      title: 'Новогодние выходные',
      minutes: 0,
      notes: '31.12–02.01 — без занятий.',
    },
  ],
  22: [
    {
      id: 'exam-05',
      date: '2027-01-30',
      kind: 'exam',
      title: 'Пробный экзамен №5: весь семестр',
      minutes: 90,
    },
  ],
}

const RESERVE_RANGES: [number, string, string][] = [
  [13, '2026-11-23', '2026-11-29'],
  [14, '2026-11-30', '2026-12-06'],
  [15, '2026-12-07', '2026-12-13'],
  [16, '2026-12-14', '2026-12-20'],
  [17, '2026-12-21', '2026-12-27'],
  [18, '2026-12-28', '2027-01-03'],
  [19, '2027-01-04', '2027-01-10'],
  [20, '2027-01-11', '2027-01-17'],
  [21, '2027-01-18', '2027-01-24'],
  [22, '2027-01-25', '2027-01-31'],
  [23, '2027-02-01', '2027-02-07'],
]

const RESERVE_WEEKS: Week[] = RESERVE_RANGES.map(([n, from, to]) => {
  const mini = MINI_CHECK_DATES.find((date) => date >= from && date <= to)
  const sessions: Session[] = mini
    ? [
        {
          id: miniCheckId(mini),
          date: mini,
          kind: 'check',
          title: 'Мини-проверка: темы 1–24 вразброс',
          minutes: 15,
          notes: '15 минут, 3 задачи, без конспекта.',
        },
      ]
    : []
  sessions.push(...(RESERVE_FIXED[n] ?? []))
  sessions.sort((a, b) => a.date.localeCompare(b.date))
  return {
    n,
    from,
    to,
    block: 'C',
    focus: 'Резерв',
    sessions,
    note: n === 23 ? 'Только повтор по журналу ошибок, ничего нового.' : undefined,
  }
})

export const WEEKS: Week[] = [...CORE_WEEKS, ...RESERVE_WEEKS]

/** Плоский список всех занятий плана (без пользовательских) */
export const ALL_SESSIONS: Session[] = WEEKS.flatMap((week) => week.sessions)
