// Банк тестов сайта. Источник — math_roadmap_test_bank.md: рабочая программа
// РУТ (МИИТ), 2026, темы 1–24, под уже заложенные проверки diag, check-01…08,
// exam-01…05 и 8 мини-проверок резерва.
// Автопроверки нет: сайт показывает условие, ответ/ключ открывается по кнопке,
// итоговый балл пользователь выставляет сам в форму результата.
// Все строки с LaTeX — через String.raw, чтобы \f, \b, \n не стали управляющими символами.

import { MINI_CHECK_DATES, miniCheckId } from './plan'

export type TestItemKind = 'problem' | 'theory'

export interface TestItem {
  /** Номер из банка: 'D1', '1.1', '1.T1', 'E1.T1', 'M1.1' */
  id: string
  kind: TestItemKind
  /** Короткая тема задания: 'СЛАУ', 'Определитель', 'Правило Лопиталя' */
  title: string
  /** Условие; инлайн-математика $...$, выключная $$...$$ */
  prompt: string
  /** Для задач — «Ответ», для теории — «Ключ». Пустая строка, если в банке ключа нет (теория пробных экзаменов №3–5) */
  answer: string
  /** Темы программы 1–24, которые проверяет задание */
  topics: number[]
}

export interface TestVariant {
  /** Совпадает с Check.id из ./checks: 'diag', 'check-01'…'check-08', 'exam-01'…'exam-05', mini-<дата> */
  checkId: string
  items: TestItem[]
}

const NAMED: TestVariant[] = [
  // Диагностика — 6 задач, 40 минут, без конспекта
  {
    checkId: 'diag',
    items: [
      {
        id: 'D1',
        kind: 'problem',
        title: 'СЛАУ',
        prompt: String.raw`Решить систему: $$\begin{cases}2x+y=5,\\x-y=1.\end{cases}$$`,
        answer: String.raw`$x=2,\ y=1$.`,
        topics: [3, 4],
      },
      {
        id: 'D2',
        kind: 'problem',
        title: 'Векторы',
        prompt: String.raw`Для $\mathbf a=(1,2,-1)$ и $\mathbf b=(2,-1,3)$ найти $\mathbf a\cdot\mathbf b$.`,
        answer: String.raw`$-3$.`,
        topics: [6],
      },
      {
        id: 'D3',
        kind: 'problem',
        title: 'Аналитическая геометрия',
        prompt: String.raw`Найти расстояние от точки $P(1,-2)$ до прямой $3x-4y+5=0$.`,
        answer: String.raw`$\frac{16}{5}$.`,
        topics: [8],
      },
      {
        id: 'D4',
        kind: 'problem',
        title: 'Предел',
        prompt: String.raw`Вычислить $\displaystyle\lim_{x\to2}\frac{x^2-4}{x-2}$.`,
        answer: String.raw`$4$.`,
        topics: [14],
      },
      {
        id: 'D5',
        kind: 'problem',
        title: 'Производная',
        prompt: String.raw`Для $f(x)=x^3-3x$ найти $f'(1)$.`,
        answer: String.raw`$0$.`,
        topics: [18],
      },
      {
        id: 'D6',
        kind: 'problem',
        title: 'Непрерывность',
        prompt: String.raw`Классифицировать точку $x=1$ для функции $f(x)=\frac{x^2-1}{x-1}$, если в $x=1$ функция не определена.`,
        answer: String.raw`устранимый разрыв; $\lim_{x\to1}f(x)=2$.`,
        topics: [17],
      },
    ],
  },

  // Проверка №1 — матрицы + векторы
  {
    checkId: 'check-01',
    items: [
      {
        id: '1.1',
        kind: 'problem',
        title: 'Произведение матриц',
        prompt: String.raw`Пусть $$A=\begin{pmatrix}1&2\\-1&3\end{pmatrix},\qquad B=\begin{pmatrix}2&0\\4&-1\end{pmatrix}.$$ Найти $AB$.`,
        answer: String.raw`$$\begin{pmatrix}10&-2\\10&-3\end{pmatrix}$$`,
        topics: [1],
      },
      {
        id: '1.2',
        kind: 'problem',
        title: 'Определитель',
        prompt: String.raw`Вычислить $$\det\begin{pmatrix}1&2&0\\-1&3&1\\2&0&1\end{pmatrix}$$`,
        answer: String.raw`$9$.`,
        topics: [2],
      },
      {
        id: '1.3',
        kind: 'problem',
        title: 'Обратная матрица',
        prompt: String.raw`Найти обратную к $$A=\begin{pmatrix}2&1\\1&1\end{pmatrix}$$`,
        answer: String.raw`$$A^{-1}=\begin{pmatrix}1&-1\\-1&2\end{pmatrix}$$`,
        topics: [3],
      },
      {
        id: '1.4',
        kind: 'problem',
        title: 'Ранг',
        prompt: String.raw`Найти ранг матрицы $$\begin{pmatrix}1&2&3\\2&4&6\\1&1&0\end{pmatrix}$$`,
        answer: String.raw`$2$.`,
        topics: [4],
      },
      {
        id: '1.5',
        kind: 'problem',
        title: 'Угол между векторами',
        prompt: String.raw`Найти угол между $\mathbf a=(1,1,0)$ и $\mathbf b=(1,0,1)$.`,
        answer: String.raw`$60^\circ$, так как $\cos\varphi=\frac12$.`,
        topics: [6],
      },
      {
        id: '1.6',
        kind: 'problem',
        title: 'Смешанное произведение и объёмы',
        prompt: String.raw`Пусть $\mathbf a=(1,0,0)$, $\mathbf b=(0,2,0)$, $\mathbf c=(0,0,3)$. Найти объём параллелепипеда и тетраэдра на этих векторах.`,
        answer: String.raw`$V_{\parallel}=6$, $V_{\text{tetra}}=1$.`,
        topics: [7],
      },
      {
        id: '1.T1',
        kind: 'theory',
        title: 'Определитель',
        prompt: String.raw`Сформулировать: минор, алгебраическое дополнение, разложение определителя по строке; назвать минимум три свойства определителя.`,
        answer: String.raw`$A_{ij}=(-1)^{i+j}M_{ij}$, $\det A=\sum_j a_{ij}A_{ij}$; допустимы свойства про перестановку строк, умножение строки, прибавление кратной строки, $\det(AB)$, треугольную матрицу.`,
        topics: [2],
      },
      {
        id: '1.T2',
        kind: 'theory',
        title: 'Произведения векторов',
        prompt: String.raw`Дать определения скалярного, векторного и смешанного произведений и их геометрический смысл.`,
        answer: String.raw`скалярное — угол/ортогональность; векторное — площадь и нормаль; смешанное — ориентированный объём, ноль как условие компланарности.`,
        topics: [6, 7],
      },
    ],
  },

  // Проверка №2 — кривые, Лопиталь, параметрические и высшие производные
  {
    checkId: 'check-02',
    items: [
      {
        id: '2.1',
        kind: 'problem',
        title: 'Эллипс',
        prompt: String.raw`Для $\frac{x^2}{9}+\frac{y^2}{4}=1$ найти $a,b,c,e$ и директрисы.`,
        answer: String.raw`$a=3$, $b=2$, $c=\sqrt5$, $e=\frac{\sqrt5}{3}$, $x=\pm\frac{9}{\sqrt5}$.`,
        topics: [11],
      },
      {
        id: '2.2',
        kind: 'problem',
        title: 'Гипербола',
        prompt: String.raw`Привести $4x^2-9y^2=36$ к каноническому виду и указать тип кривой.`,
        answer: String.raw`$\frac{x^2}{9}-\frac{y^2}{4}=1$, гипербола.`,
        topics: [11],
      },
      {
        id: '2.3',
        kind: 'problem',
        title: 'Общее уравнение кривой второго порядка',
        prompt: String.raw`Привести к каноническому виду: $x^2+4x+4y^2-8y+4=0$.`,
        answer: String.raw`$\frac{(x+2)^2}{4}+(y-1)^2=1$.`,
        topics: [11],
      },
      {
        id: '2.4',
        kind: 'problem',
        title: 'Лопиталь',
        prompt: String.raw`Вычислить $\displaystyle\lim_{x\to0}\frac{e^x-1-x}{x^2}$.`,
        answer: String.raw`$\frac12$.`,
        topics: [24],
      },
      {
        id: '2.5',
        kind: 'problem',
        title: 'Параметрическая производная',
        prompt: String.raw`$x=t^2+1$, $y=t^3$. Найти $\frac{dy}{dx}$ и $\frac{d^2y}{dx^2}$ при $t=1$.`,
        answer: String.raw`$\frac{dy}{dx}=\frac32$, $\frac{d^2y}{dx^2}=\frac34$.`,
        topics: [21],
      },
      {
        id: '2.6',
        kind: 'problem',
        title: 'Дифференциал',
        prompt: String.raw`Приближённо вычислить $\sqrt{4.1}$ с помощью дифференциала в точке $x_0=4$.`,
        answer: String.raw`$2.025$.`,
        topics: [22],
      },
      {
        id: '2.T1',
        kind: 'theory',
        title: 'Правило Лопиталя',
        prompt: String.raw`Сформулировать правило Лопиталя для неопределённостей $0/0$ и $\infty/\infty$ и перечислить основные условия применения.`,
        answer: String.raw`дифференцируемость в проколотой окрестности, $g'\ne0$, исходная неопределённость допустимого типа, существование предела $f'/g'$ при стандартных условиях.`,
        topics: [24],
      },
      {
        id: '2.T2',
        kind: 'theory',
        title: 'Параметрическая функция и высшие производные',
        prompt: String.raw`Записать формулы для $dy/dx$ и $d^2y/dx^2$ при $x=x(t)$, $y=y(t)$.`,
        answer: String.raw`$\frac{dy}{dx}=\frac{y_t'}{x_t'}$, $\frac{d^2y}{dx^2}=\frac{\frac d{dt}(dy/dx)}{x_t'}$.`,
        topics: [21],
      },
    ],
  },

  // Проверка №3 — СЛАУ + прямая на плоскости
  {
    checkId: 'check-03',
    items: [
      {
        id: '3.1',
        kind: 'problem',
        title: 'Крамер',
        prompt: String.raw`Решить систему: $$\begin{cases}x+y+z=6,\\2x-y+z=3,\\x+2y-z=2.\end{cases}$$`,
        answer: String.raw`$(x,y,z)=(1,2,3)$.`,
        topics: [3],
      },
      {
        id: '3.2',
        kind: 'problem',
        title: 'Гаусс и число решений',
        prompt: String.raw`Исследовать систему: $$\begin{cases}x+y+z=1,\\2x+2y+2z=2,\\x-y=0.\end{cases}$$`,
        answer: String.raw`бесконечно много решений: $x=y=t$, $z=1-2t$.`,
        topics: [4],
      },
      {
        id: '3.3',
        kind: 'problem',
        title: 'Прямая через две точки',
        prompt: String.raw`Составить уравнение прямой через $A(1,2)$ и $B(3,-2)$.`,
        answer: String.raw`$2x+y-4=0$.`,
        topics: [8],
      },
      {
        id: '3.4',
        kind: 'problem',
        title: 'Угол между прямыми',
        prompt: String.raw`Найти угол между $2x-y+1=0$ и $x+2y-3=0$.`,
        answer: String.raw`$90^\circ$.`,
        topics: [8],
      },
      {
        id: '3.5',
        kind: 'problem',
        title: 'Расстояние до прямой',
        prompt: String.raw`Найти расстояние от $P(2,-1)$ до $3x+4y-10=0$.`,
        answer: String.raw`$\frac85$.`,
        topics: [8],
      },
      {
        id: '3.6',
        kind: 'problem',
        title: 'Площадь треугольника',
        prompt: String.raw`Даны $A(0,0)$, $B(4,0)$, $C(1,3)$. Найти площадь треугольника.`,
        answer: String.raw`$6$.`,
        topics: [8],
      },
      {
        id: '3.T1',
        kind: 'theory',
        title: 'Формулы Крамера',
        prompt: String.raw`Сформулировать условие применимости формул Крамера и записать формулу для $x_i$.`,
        answer: String.raw`$\det A\ne0$, $x_i=\Delta_i/\Delta$.`,
        topics: [3],
      },
      {
        id: '3.T2',
        kind: 'theory',
        title: 'Формы уравнения прямой',
        prompt: String.raw`Перечислить и записать основные формы задания прямой на плоскости.`,
        answer: String.raw`общее, $y=kx+b$, через точку и направление, через две точки, параметрическое, в отрезках.`,
        topics: [8],
      },
    ],
  },

  // Пробный экзамен №1 — алгебра + геометрия (билет: сначала теория, потом задачи)
  {
    checkId: 'exam-01',
    items: [
      {
        id: 'E1.T1',
        kind: 'theory',
        title: 'Определители и обратная матрица',
        prompt: String.raw`Дать определения минора и алгебраического дополнения; объяснить, когда существует обратная матрица и как она выражается через присоединённую.`,
        answer: String.raw`$A_{ij}=(-1)^{i+j}M_{ij}$, $A^{-1}=\frac1{\det A}\operatorname{adj}A$, условие $\det A\ne0$.`,
        topics: [2, 3],
      },
      {
        id: 'E1.T2',
        kind: 'theory',
        title: 'Прямая и плоскость в пространстве',
        prompt: String.raw`Записать каноническое/параметрическое уравнение прямой и уравнение плоскости через точку и нормаль; формулу угла между прямой и плоскостью.`,
        answer: String.raw`$\mathbf r=\mathbf r_0+t\mathbf s$, $\mathbf n\cdot(\mathbf r-\mathbf r_0)=0$, $\sin\varphi=|\mathbf s\cdot\mathbf n|/(|\mathbf s||\mathbf n|)$.`,
        topics: [9, 10],
      },
      {
        id: 'E1.1',
        kind: 'problem',
        title: 'СЛАУ',
        prompt: String.raw`Решить $$\begin{cases}2x+y=7,\\x-y=2.\end{cases}$$`,
        answer: String.raw`$x=3$, $y=1$.`,
        topics: [3, 4],
      },
      {
        id: 'E1.2',
        kind: 'problem',
        title: 'Векторное произведение',
        prompt: String.raw`Для $\mathbf a=(1,2,0)$, $\mathbf b=(0,1,3)$ найти $\mathbf a\times\mathbf b$ и площадь параллелограмма.`,
        answer: String.raw`$\mathbf a\times\mathbf b=(6,-3,1)$, $S=\sqrt{46}$.`,
        topics: [7],
      },
      {
        id: 'E1.3',
        kind: 'problem',
        title: 'Прямая на плоскости',
        prompt: String.raw`Составить уравнение прямой через $(1,-1)$, параллельной вектору $(2,3)$.`,
        answer: String.raw`$3x-2y-5=0$.`,
        topics: [8],
      },
      {
        id: 'E1.4',
        kind: 'problem',
        title: 'Плоскость и расстояние',
        prompt: String.raw`Составить уравнение плоскости через $P(1,0,2)$ с нормалью $(2,-1,3)$ и найти расстояние от $Q(0,1,0)$ до неё.`,
        answer: String.raw`$2x-y+3z-8=0$, $d=\frac9{\sqrt{14}}$.`,
        topics: [10],
      },
    ],
  },

  // Проверка №4 — пределы, часть 1
  {
    checkId: 'check-04',
    items: [
      {
        id: '4.1',
        kind: 'problem',
        title: 'Область определения',
        prompt: String.raw`Найти область определения $f(x)=\frac{\sqrt{5-2x}}{x-1}$.`,
        answer: String.raw`$(-\infty,1)\cup(1,\frac52]$.`,
        topics: [12],
      },
      {
        id: '4.2',
        kind: 'problem',
        title: 'Предел последовательности',
        prompt: String.raw`Вычислить $\displaystyle\lim_{n\to\infty}n(\sqrt{n^2+1}-n)$.`,
        answer: String.raw`$\frac12$.`,
        topics: [13],
      },
      {
        id: '4.3',
        kind: 'problem',
        title: 'Предел на бесконечности',
        prompt: String.raw`$\displaystyle\lim_{x\to\infty}\frac{3x^2-x+1}{x^2+2}$.`,
        answer: String.raw`$3$.`,
        topics: [14],
      },
      {
        id: '4.4',
        kind: 'problem',
        title: 'Неопределённость 0/0',
        prompt: String.raw`$\displaystyle\lim_{x\to2}\frac{x^2-4}{x^2-5x+6}$.`,
        answer: String.raw`$-4$.`,
        topics: [14],
      },
      {
        id: '4.5',
        kind: 'problem',
        title: 'Рационализация',
        prompt: String.raw`$\displaystyle\lim_{x\to0}\frac{\sqrt{1+x}-1}{x}$.`,
        answer: String.raw`$\frac12$.`,
        topics: [14],
      },
      {
        id: '4.6',
        kind: 'problem',
        title: 'Неопределённость ∞−∞',
        prompt: String.raw`$\displaystyle\lim_{x\to\infty}(\sqrt{x^2+x}-x)$.`,
        answer: String.raw`$\frac12$.`,
        topics: [14],
      },
      {
        id: '4.T1',
        kind: 'theory',
        title: 'Предел функции',
        prompt: String.raw`Дать $\varepsilon-\delta$-определение предела функции в точке и объяснить роль односторонних пределов.`,
        answer: String.raw`корректная формулировка $0<|x-a|<\delta\Rightarrow|f(x)-L|<\varepsilon$; двусторонний предел существует при равенстве обоих односторонних.`,
        topics: [14],
      },
      {
        id: '4.T2',
        kind: 'theory',
        title: 'Бесконечно малые',
        prompt: String.raw`Определить бесконечно малую функцию и записать связь $f(x)=A+\alpha(x)$ с пределом $A$.`,
        answer: String.raw`$\alpha(x)\to0$; $\lim f=A \iff f=A+\alpha$.`,
        topics: [15],
      },
    ],
  },

  // Проверка №5 — пределы, часть 2
  {
    checkId: 'check-05',
    items: [
      {
        id: '5.1',
        kind: 'problem',
        title: 'Первый замечательный предел',
        prompt: String.raw`$\displaystyle\lim_{x\to0}\frac{\sin5x}{x}$.`,
        answer: String.raw`$5$.`,
        topics: [16],
      },
      {
        id: '5.2',
        kind: 'problem',
        title: 'Эквивалентность логарифма',
        prompt: String.raw`$\displaystyle\lim_{x\to0}\frac{\ln(1+3x)}{x}$.`,
        answer: String.raw`$3$.`,
        topics: [16],
      },
      {
        id: '5.3',
        kind: 'problem',
        title: 'Эквивалентности',
        prompt: String.raw`$\displaystyle\lim_{x\to0}\frac{e^{2x}-1}{\sin3x}$.`,
        answer: String.raw`$\frac23$.`,
        topics: [16],
      },
      {
        id: '5.4',
        kind: 'problem',
        title: 'Второй замечательный предел',
        prompt: String.raw`$\displaystyle\lim_{x\to\infty}\left(1+\frac2x\right)^{3x}$.`,
        answer: String.raw`$e^6$.`,
        topics: [16],
      },
      {
        id: '5.5',
        kind: 'problem',
        title: 'Косинус',
        prompt: String.raw`$\displaystyle\lim_{x\to0}\frac{1-\cos x}{x^2}$.`,
        answer: String.raw`$\frac12$.`,
        topics: [16],
      },
      {
        id: '5.6',
        kind: 'problem',
        title: 'Более сложная эквивалентность',
        prompt: String.raw`$\displaystyle\lim_{x\to0}\frac{\tan x-\sin x}{x^3}$.`,
        answer: String.raw`$\frac12$.`,
        topics: [16],
      },
      {
        id: '5.T1',
        kind: 'theory',
        title: 'Два замечательных предела',
        prompt: String.raw`Сформулировать первый и второй замечательные пределы и одну эквивалентную форму второго.`,
        answer: String.raw`$\sin x/x\to1$; $(1+1/x)^x\to e$; $(1+x)^{1/x}\to e$.`,
        topics: [16],
      },
      {
        id: '5.T2',
        kind: 'theory',
        title: 'Таблица эквивалентностей',
        prompt: String.raw`Назвать минимум пять стандартных эквивалентных бесконечно малых при $x\to0$.`,
        answer: String.raw`например $\sin x\sim x$, $\tan x\sim x$, $1-\cos x\sim x^2/2$, $e^x-1\sim x$, $\ln(1+x)\sim x$, $(1+x)^\alpha-1\sim\alpha x$.`,
        topics: [16],
      },
    ],
  },

  // Пробный экзамен №2 — пределы + непрерывность
  {
    checkId: 'exam-02',
    items: [
      {
        id: 'E2.T1',
        kind: 'theory',
        title: 'Непрерывность',
        prompt: String.raw`Дать определение непрерывности в точке и классификацию разрывов: устранимый, первого рода, второго рода.`,
        answer: String.raw`предел равен значению; для классификации использовать односторонние пределы.`,
        topics: [17],
      },
      {
        id: 'E2.T2',
        kind: 'theory',
        title: 'Теоремы о непрерывных функциях',
        prompt: String.raw`Сформулировать основные свойства непрерывных функций на отрезке: ограниченность, достижение min/max, промежуточные значения.`,
        answer: String.raw`теоремы Вейерштрасса и о промежуточном значении в корректной формулировке.`,
        topics: [17],
      },
      {
        id: 'E2.1',
        kind: 'problem',
        title: 'Предел',
        prompt: String.raw`$\displaystyle\lim_{x\to0}\frac{\sqrt{1+2x}-1}{x}$.`,
        answer: String.raw`$1$.`,
        topics: [14],
      },
      {
        id: 'E2.2',
        kind: 'problem',
        title: 'Непрерывное доопределение',
        prompt: String.raw`$f(x)=\frac{\sin x}{x}$ при $x\ne0$, $f(0)=a$. Найти $a$, чтобы функция была непрерывна.`,
        answer: String.raw`$a=1$.`,
        topics: [17],
      },
      {
        id: 'E2.3',
        kind: 'problem',
        title: 'Устранимый разрыв',
        prompt: String.raw`$f(x)=\frac{x^2-1}{x-1}$ при $x\ne1$, $f(1)=5$. Классифицировать точку $x=1$.`,
        answer: String.raw`устранимый разрыв, потому что предел равен $2$, а значение равно $5$.`,
        topics: [17],
      },
      {
        id: 'E2.4',
        kind: 'problem',
        title: 'Скачок',
        prompt: String.raw`Классифицировать точку $x=0$ функции $f(x)=\frac{x}{|x|}$ при $x\ne0$.`,
        answer: String.raw`разрыв первого рода (скачок): левый предел $-1$, правый $1$.`,
        topics: [17],
      },
    ],
  },

  // Проверка №6 — производная, часть 1
  {
    checkId: 'check-06',
    items: [
      {
        id: '6.1',
        kind: 'problem',
        title: 'Полином',
        prompt: String.raw`Найти производную $f(x)=x^3-5x^2+2x$.`,
        answer: String.raw`$f'(x)=3x^2-10x+2$.`,
        topics: [18],
      },
      {
        id: '6.2',
        kind: 'problem',
        title: 'Произведение',
        prompt: String.raw`$f(x)=(x^2+1)e^x$.`,
        answer: String.raw`$f'(x)=e^x(x+1)^2$.`,
        topics: [18],
      },
      {
        id: '6.3',
        kind: 'problem',
        title: 'Сложная функция',
        prompt: String.raw`$f(x)=\ln(1+x^2)$.`,
        answer: String.raw`$f'(x)=\frac{2x}{1+x^2}$.`,
        topics: [19],
      },
      {
        id: '6.4',
        kind: 'problem',
        title: 'Многоуровневая композиция',
        prompt: String.raw`$f(x)=\sin^2(3x)$.`,
        answer: String.raw`$f'(x)=6\sin3x\cos3x=3\sin6x$.`,
        topics: [19],
      },
      {
        id: '6.5',
        kind: 'problem',
        title: 'Касательная и нормаль',
        prompt: String.raw`Для $y=x^2+1$ в точке $x_0=2$ составить уравнения касательной и нормали.`,
        answer: String.raw`касательная $y=4x-3$; нормаль $y-5=-\frac14(x-2)$.`,
        topics: [18],
      },
      {
        id: '6.6',
        kind: 'problem',
        title: 'Обратная функция',
        prompt: String.raw`Найти $(\arctan x)'$ при $x=1$.`,
        answer: String.raw`$\frac12$.`,
        topics: [19],
      },
      {
        id: '6.T1',
        kind: 'theory',
        title: 'Производная',
        prompt: String.raw`Дать определение производной и объяснить геометрический и механический смысл.`,
        answer: String.raw`предел отношения приращений; угловой коэффициент касательной; мгновенная скорость.`,
        topics: [18],
      },
      {
        id: '6.T2',
        kind: 'theory',
        title: 'Дифференцируемость и непрерывность',
        prompt: String.raw`Сформулировать связь между дифференцируемостью и непрерывностью.`,
        answer: String.raw`дифференцируемость в точке влечёт непрерывность; обратное в общем случае неверно.`,
        topics: [18],
      },
    ],
  },

  // Проверка №7 — производная, часть 2
  {
    checkId: 'check-07',
    items: [
      {
        id: '7.1',
        kind: 'problem',
        title: 'Степенно-показательная функция',
        prompt: String.raw`Найти производную $y=x^x$, $x>0$.`,
        answer: String.raw`$y'=x^x(\ln x+1)$.`,
        topics: [20],
      },
      {
        id: '7.2',
        kind: 'problem',
        title: 'Неявная функция',
        prompt: String.raw`Для $x^2+y^2=25$ найти $y'$ и его значение в точке $(3,4)$.`,
        answer: String.raw`$y'=-x/y$, в точке $(3,4)$: $-3/4$.`,
        topics: [20],
      },
      {
        id: '7.3',
        kind: 'problem',
        title: 'Параметрическая функция',
        prompt: String.raw`$x=t^2$, $y=t^3$. Найти $dy/dx$ и $d^2y/dx^2$ при $t=2$.`,
        answer: String.raw`$dy/dx=3$, $d^2y/dx^2=3/8$.`,
        topics: [21],
      },
      {
        id: '7.4',
        kind: 'problem',
        title: 'Высшая производная',
        prompt: String.raw`Найти третью производную $y=e^{2x}$.`,
        answer: String.raw`$y'''=8e^{2x}$.`,
        topics: [21],
      },
      {
        id: '7.5',
        kind: 'problem',
        title: 'Приближённое вычисление',
        prompt: String.raw`С помощью дифференциала приближённо вычислить $(1.02)^5$ около $x_0=1$ для $f(x)=x^5$.`,
        answer: String.raw`$1.10$.`,
        topics: [22],
      },
      {
        id: '7.6',
        kind: 'problem',
        title: 'Логарифмическое дифференцирование',
        prompt: String.raw`Найти производную $y=(x^2+1)^{\sin x}$.`,
        answer: String.raw`$y'=y\left(\cos x\ln(x^2+1)+\sin x\frac{2x}{x^2+1}\right)$.`,
        topics: [20],
      },
      {
        id: '7.T1',
        kind: 'theory',
        title: 'Дифференциал',
        prompt: String.raw`Дать определение дифференциала и записать формулу линейного приближения функции.`,
        answer: String.raw`$dy=f'(x)dx$, $f(x+\Delta x)\approx f(x)+f'(x)\Delta x$.`,
        topics: [22],
      },
      {
        id: '7.T2',
        kind: 'theory',
        title: 'Высшие производные',
        prompt: String.raw`Определить производные высших порядков и записать формулу второго параметрического производного.`,
        answer: String.raw`$y^{(n)}$; $d^2y/dx^2=[d/dt(dy/dx)]/x'(t)$.`,
        topics: [21],
      },
    ],
  },

  // Проверка №8 — теоремы, Лопиталь, экстремумы, выпуклость, асимптоты
  {
    checkId: 'check-08',
    items: [
      {
        id: '8.1',
        kind: 'problem',
        title: 'Теорема Ролля',
        prompt: String.raw`Для $f(x)=x^2-4x+3$ на $[1,3]$ найти точку $c$, существование которой гарантирует теорема Ролля.`,
        answer: String.raw`$c=2$.`,
        topics: [23],
      },
      {
        id: '8.2',
        kind: 'problem',
        title: 'Теорема Лагранжа',
        prompt: String.raw`Для $f(x)=x^2$ на $[1,3]$ найти $c$, удовлетворяющую теореме Лагранжа.`,
        answer: String.raw`$c=2$.`,
        topics: [23],
      },
      {
        id: '8.3',
        kind: 'problem',
        title: 'Повторное применение Лопиталя',
        prompt: String.raw`$\displaystyle\lim_{x\to0}\frac{\sin x-x}{x^3}$.`,
        answer: String.raw`$-\frac16$.`,
        topics: [24],
      },
      // сверх тем 1–24 программы 2026, оставлено по плану сайта
      {
        id: '8.4',
        kind: 'problem',
        title: 'Экстремумы',
        prompt: String.raw`Исследовать на локальные экстремумы $f(x)=x^3-3x$.`,
        answer: String.raw`локальный максимум в $x=-1$, $f(-1)=2$; локальный минимум в $x=1$, $f(1)=-2$.`,
        topics: [],
      },
      // сверх тем 1–24 программы 2026, оставлено по плану сайта
      {
        id: '8.5',
        kind: 'problem',
        title: 'Выпуклость и точки перегиба',
        prompt: String.raw`Для $f(x)=x^4-2x^2$ найти интервалы выпуклости/вогнутости и точки перегиба.`,
        answer: String.raw`$f''=12x^2-4$; смена знака при $x=\pm1/\sqrt3$; точки $\left(\pm\frac1{\sqrt3},-\frac59\right)$. $f''<0$ при $|x|<1/\sqrt3$, $f''>0$ вне этого интервала.`,
        topics: [],
      },
      // сверх тем 1–24 программы 2026, оставлено по плану сайта
      {
        id: '8.6',
        kind: 'problem',
        title: 'Асимптоты',
        prompt: String.raw`Найти асимптоты $f(x)=\frac{2x^2+1}{x-1}$.`,
        answer: String.raw`вертикальная $x=1$; наклонная $y=2x+2$.`,
        topics: [],
      },
      {
        id: '8.T1',
        kind: 'theory',
        title: 'Теоремы Ферма, Ролля, Лагранжа и Коши',
        prompt: String.raw`Сформулировать условия и заключения четырёх теорем.`,
        answer: String.raw`непрерывность/дифференцируемость в нужных областях; корректные формулы $f'(c)=0$, $f'(c)=(f(b)-f(a))/(b-a)$ и аналог Коши.`,
        topics: [23],
      },
      {
        id: '8.T2',
        kind: 'theory',
        title: 'Лопиталь',
        prompt: String.raw`Назвать допустимые неопределённости и способы сведения $0\cdot\infty$, $\infty-\infty$, $1^\infty$ к формам, с которыми можно работать.`,
        answer: String.raw`отношения для $0\cdot\infty$, общая дробь/рационализация для $\infty-\infty$, логарифмирование для степенных неопределённостей.`,
        topics: [24],
      },
    ],
  },

  // Пробный экзамен №3 — весь семестр, вариант A (ключей к теории в банке нет)
  {
    checkId: 'exam-03',
    items: [
      {
        id: 'E3.T1',
        kind: 'theory',
        title: 'Произведения векторов',
        prompt: String.raw`Скалярное, векторное и смешанное произведения: определения, свойства, геометрический смысл и применения к углам, площадям и объёмам.`,
        answer: '',
        topics: [6, 7],
      },
      {
        id: 'E3.T2',
        kind: 'theory',
        title: 'Замечательные пределы',
        prompt: String.raw`Сформулировать два замечательных предела и перечислить основные эквивалентные бесконечно малые.`,
        answer: '',
        topics: [16],
      },
      {
        id: 'E3.1',
        kind: 'problem',
        title: 'Матрица',
        prompt: String.raw`Для $$A=\begin{pmatrix}1&2\\3&5\end{pmatrix}$$ найти $\det A$ и $A^{-1}$.`,
        answer: String.raw`$\det A=-1$, $$A^{-1}=\begin{pmatrix}-5&2\\3&-1\end{pmatrix}$$`,
        topics: [2, 3],
      },
      {
        id: 'E3.2',
        kind: 'problem',
        title: 'Плоскость',
        prompt: String.raw`Плоскость проходит через $P(1,-1,2)$ и имеет нормаль $(2,1,-2)$. Найти её уравнение и расстояние от $Q(3,0,1)$.`,
        answer: String.raw`$2x+y-2z+3=0$, $d=7/3$.`,
        topics: [10],
      },
      {
        id: 'E3.3',
        kind: 'problem',
        title: 'Предел',
        prompt: String.raw`$\displaystyle\lim_{x\to0}\frac{1-\cos2x}{x^2}$.`,
        answer: String.raw`$2$.`,
        topics: [16],
      },
      {
        id: 'E3.4',
        kind: 'problem',
        title: 'Неявная производная',
        prompt: String.raw`Для $x^2+xy+y^2=7$ найти $y'$ в точке $(1,2)$.`,
        answer: String.raw`$-4/5$.`,
        topics: [20],
      },
    ],
  },

  // Пробный экзамен №4 — весь семестр, вариант B (ключей к теории в банке нет)
  {
    checkId: 'exam-04',
    items: [
      {
        id: 'E4.T1',
        kind: 'theory',
        title: 'Кривые второго порядка',
        prompt: String.raw`Канонические уравнения эллипса, гиперболы и параболы; фокусы, эксцентриситет, директрисы.`,
        answer: '',
        topics: [11],
      },
      {
        id: 'E4.T2',
        kind: 'theory',
        title: 'Теоремы Ролля и Лагранжа',
        prompt: String.raw`Сформулировать обе теоремы и объяснить их геометрический смысл.`,
        answer: '',
        topics: [23],
      },
      {
        id: 'E4.1',
        kind: 'problem',
        title: 'СЛАУ',
        prompt: String.raw`Решить: $$\begin{cases}x+y+z=2,\\x-y+z=0,\\2x+y-z=3.\end{cases}$$`,
        answer: String.raw`$(1,1,0)$.`,
        topics: [3, 4],
      },
      {
        id: 'E4.2',
        kind: 'problem',
        title: 'Площадь по векторам',
        prompt: String.raw`Для $\mathbf a=(1,2,1)$, $\mathbf b=(2,-1,0)$ найти площадь треугольника на этих векторах.`,
        answer: String.raw`$\frac{\sqrt{30}}{2}$.`,
        topics: [7],
      },
      {
        id: 'E4.3',
        kind: 'problem',
        title: 'Непрерывность с параметром',
        prompt: String.raw`$f(x)=\frac{e^x-1}{x}$ при $x\ne0$, $f(0)=a$. Найти $a$ для непрерывности.`,
        answer: String.raw`$a=1$.`,
        topics: [17],
      },
      {
        id: 'E4.4',
        kind: 'problem',
        title: 'Логарифмическое дифференцирование',
        prompt: String.raw`Для $y=(x^2+1)^x$ найти $y'(1)$.`,
        answer: String.raw`$2\ln2+2$.`,
        topics: [20],
      },
    ],
  },

  // Пробный экзамен №5 — весь семестр, вариант C (ключей к теории в банке нет)
  {
    checkId: 'exam-05',
    items: [
      {
        id: 'E5.T1',
        kind: 'theory',
        title: 'Ранг и метод Гаусса',
        prompt: String.raw`Определить ранг матрицы; описать элементарные преобразования и критерии единственности/бесконечности решений СЛАУ через ранги.`,
        answer: '',
        topics: [4],
      },
      {
        id: 'E5.T2',
        kind: 'theory',
        title: 'Лопиталь и дифференциал',
        prompt: String.raw`Сформулировать правило Лопиталя и объяснить формулу линейного приближения через дифференциал.`,
        answer: '',
        topics: [22, 24],
      },
      {
        id: 'E5.1',
        kind: 'problem',
        title: 'Эллипс',
        prompt: String.raw`Для $\frac{x^2}{25}+\frac{y^2}{9}=1$ найти $c$, $e$ и директрисы.`,
        answer: String.raw`$c=4$, $e=4/5$, $x=\pm25/4$.`,
        topics: [11],
      },
      {
        id: 'E5.2',
        kind: 'problem',
        title: 'Прямая и плоскость',
        prompt: String.raw`Прямая задана: $x=1+2t$, $y=-t$, $z=-1+2t$. Плоскость: $x+2y-z-4=0$. Найти точку пересечения и синус угла между прямой и плоскостью.`,
        answer: String.raw`$t=-1$, точка $(-1,1,-3)$; $\sin\varphi=\frac{2}{3\sqrt6}$.`,
        topics: [9, 10],
      },
      {
        id: 'E5.3',
        kind: 'problem',
        title: 'Предел',
        prompt: String.raw`$\displaystyle\lim_{x\to0}\frac{\ln(1+x)-x}{x^2}$.`,
        answer: String.raw`$-\frac12$.`,
        topics: [24],
      },
      {
        id: 'E5.4',
        kind: 'problem',
        title: 'Параметрическая производная',
        prompt: String.raw`$x=t^2+2t$, $y=t^3$. Найти $dy/dx$ при $t=1$.`,
        answer: String.raw`$3/4$.`,
        topics: [21],
      },
    ],
  },
]

/** Мини-проверки резерва: 8 наборов по 3 задачи, каждый закрывает три последовательные темы 1–24 */
const MINI_SETS: TestItem[][] = [
  // Мини-проверка 1 — темы 1–3
  [
    {
      id: 'M1.1',
      kind: 'problem',
      title: 'Матрицы',
      prompt: String.raw`$$\begin{pmatrix}1&2\\0&-1\end{pmatrix}\begin{pmatrix}2&1\\3&0\end{pmatrix}$$`,
      answer: String.raw`$$\begin{pmatrix}8&1\\-3&0\end{pmatrix}$$`,
      topics: [1],
    },
    {
      id: 'M1.2',
      kind: 'problem',
      title: 'Определитель',
      prompt: String.raw`$$\det\begin{pmatrix}2&1&0\\-1&3&2\\0&4&1\end{pmatrix}$$`,
      answer: String.raw`$-9$.`,
      topics: [2],
    },
    {
      id: 'M1.3',
      kind: 'problem',
      title: 'Крамер',
      prompt: String.raw`$$\begin{cases}2x-y=1,\\x+y=5.\end{cases}$$`,
      answer: String.raw`$x=2$, $y=3$.`,
      topics: [3],
    },
  ],
  // Мини-проверка 2 — темы 4–6
  [
    {
      id: 'M2.1',
      kind: 'problem',
      title: 'Ранг',
      prompt: String.raw`Найти ранг $$\begin{pmatrix}1&2\\2&4\end{pmatrix}$$`,
      answer: String.raw`$1$.`,
      topics: [4],
    },
    {
      id: 'M2.2',
      kind: 'problem',
      title: 'Линейная зависимость',
      prompt: String.raw`Зависимы ли $(1,2,3)$ и $(2,4,6)$?`,
      answer: String.raw`да, второй вектор равен удвоенному первому.`,
      topics: [5],
    },
    {
      id: 'M2.3',
      kind: 'problem',
      title: 'Скалярное произведение',
      prompt: String.raw`Найти угол между $(1,0,1)$ и $(1,1,0)$.`,
      answer: String.raw`$60^\circ$.`,
      topics: [6],
    },
  ],
  // Мини-проверка 3 — темы 7–9
  [
    {
      id: 'M3.1',
      kind: 'problem',
      title: 'Смешанное произведение',
      prompt: String.raw`Для $\mathbf a=(1,0,0)$, $\mathbf b=(0,1,0)$, $\mathbf c=(1,1,2)$ найти объём параллелепипеда.`,
      answer: String.raw`$2$.`,
      topics: [7],
    },
    {
      id: 'M3.2',
      kind: 'problem',
      title: 'Прямая на плоскости',
      prompt: String.raw`Прямая проходит через $(2,-1)$ и имеет угловой коэффициент $3$. Записать общее уравнение.`,
      answer: String.raw`$3x-y-7=0$.`,
      topics: [8],
    },
    {
      id: 'M3.3',
      kind: 'problem',
      title: 'Прямая в пространстве',
      prompt: String.raw`Записать каноническое уравнение прямой через $P(1,2,0)$ с направляющим вектором $(2,-1,3)$.`,
      answer: String.raw`$\frac{x-1}{2}=\frac{y-2}{-1}=\frac z3$.`,
      topics: [9],
    },
  ],
  // Мини-проверка 4 — темы 10–12
  [
    {
      id: 'M4.1',
      kind: 'problem',
      title: 'Плоскость',
      prompt: String.raw`Составить уравнение плоскости через $P(1,-1,2)$ с нормалью $(1,2,-1)$.`,
      answer: String.raw`$x+2y-z+3=0$.`,
      topics: [10],
    },
    {
      id: 'M4.2',
      kind: 'problem',
      title: 'Гипербола',
      prompt: String.raw`Привести $9x^2-4y^2=36$ к каноническому виду и найти эксцентриситет.`,
      answer: String.raw`$\frac{x^2}{4}-\frac{y^2}{9}=1$, $e=\frac{\sqrt{13}}2$.`,
      topics: [11],
    },
    {
      id: 'M4.3',
      kind: 'problem',
      title: 'Сложная функция',
      prompt: String.raw`$f(x)=x^2+1$, $g(x)=2x-3$. Найти $(f\circ g)(x)$.`,
      answer: String.raw`$(2x-3)^2+1$.`,
      topics: [12],
    },
  ],
  // Мини-проверка 5 — темы 13–15
  [
    {
      id: 'M5.1',
      kind: 'problem',
      title: 'Предел последовательности',
      prompt: String.raw`$\displaystyle\lim_{n\to\infty}\frac{3n^2+n}{n^2-2}$.`,
      answer: String.raw`$3$.`,
      topics: [13],
    },
    {
      id: 'M5.2',
      kind: 'problem',
      title: 'Предел функции',
      prompt: String.raw`$\displaystyle\lim_{x\to1}\frac{x^3-1}{x-1}$.`,
      answer: String.raw`$3$.`,
      topics: [14],
    },
    {
      id: 'M5.3',
      kind: 'problem',
      title: 'Бесконечно малая',
      prompt: String.raw`Найти $\displaystyle\lim_{x\to0}x^2\sin\frac1x$.`,
      answer: String.raw`$0$.`,
      topics: [15],
    },
  ],
  // Мини-проверка 6 — темы 16–18
  [
    {
      id: 'M6.1',
      kind: 'problem',
      title: 'Первый замечательный предел',
      prompt: String.raw`$\displaystyle\lim_{x\to0}\frac{\sin4x}{3x}$.`,
      answer: String.raw`$4/3$.`,
      topics: [16],
    },
    {
      id: 'M6.2',
      kind: 'problem',
      title: 'Непрерывность',
      prompt: String.raw`$f(x)=\frac{x^2-1}{x-1}$ при $x\ne1$, $f(1)=a$. Найти $a$ для непрерывности.`,
      answer: String.raw`$2$.`,
      topics: [17],
    },
    {
      id: 'M6.3',
      kind: 'problem',
      title: 'Производная',
      prompt: String.raw`Для $f(x)=(x^2+1)^3$ найти $f'(1)$.`,
      answer: String.raw`$24$.`,
      topics: [18],
    },
  ],
  // Мини-проверка 7 — темы 19–21
  [
    {
      id: 'M7.1',
      kind: 'problem',
      title: 'Сложная функция',
      prompt: String.raw`Найти производную $\arcsin(2x)$.`,
      answer: String.raw`$\frac{2}{\sqrt{1-4x^2}}$.`,
      topics: [19],
    },
    {
      id: 'M7.2',
      kind: 'problem',
      title: 'Неявное дифференцирование',
      prompt: String.raw`Для $x^2+xy+y^2=3$ найти $y'$ в точке $(1,1)$.`,
      answer: String.raw`$-1$.`,
      topics: [20],
    },
    {
      id: 'M7.3',
      kind: 'problem',
      title: 'Параметрическая функция',
      prompt: String.raw`$x=t^2$, $y=t^3$. Найти $dy/dx$ при $t=2$.`,
      answer: String.raw`$3$.`,
      topics: [21],
    },
  ],
  // Мини-проверка 8 — темы 22–24
  [
    {
      id: 'M8.1',
      kind: 'problem',
      title: 'Дифференциал',
      prompt: String.raw`Приближённо найти $\sqrt[3]{8.12}$ через линейное приближение около $8$.`,
      answer: String.raw`$2.01$.`,
      topics: [22],
    },
    {
      id: 'M8.2',
      kind: 'problem',
      title: 'Теорема Лагранжа',
      prompt: String.raw`Для $f(x)=x^2$ на $[0,2]$ найти точку $c$, существование которой гарантирует теорема Лагранжа.`,
      answer: String.raw`$c=1$.`,
      topics: [23],
    },
    {
      id: 'M8.3',
      kind: 'problem',
      title: 'Лопиталь',
      prompt: String.raw`$\displaystyle\lim_{x\to0}\frac{e^x-1}{x}$.`,
      answer: String.raw`$1$.`,
      topics: [24],
    },
  ],
]

const MINI_VARIANTS: TestVariant[] = MINI_SETS.map((items, i) => ({
  checkId: miniCheckId(MINI_CHECK_DATES[i]),
  items,
}))

export const TEST_BANK: TestVariant[] = [...NAMED, ...MINI_VARIANTS]

/** Задания варианта по id проверки; пустой массив, если варианта в банке нет */
export function testsFor(checkId: string): TestItem[] {
  return TEST_BANK.find((v) => v.checkId === checkId)?.items ?? []
}
