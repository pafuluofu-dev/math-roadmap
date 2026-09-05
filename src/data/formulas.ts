export interface FormulaItem {
  /** 'f1-1', 'f1-2', … 'f24-5' — тема-порядковый */
  id: string
  /** Подпись перед формулой ('Сложение', 'Расстояние от точки'); может содержать $...$. Если пункт в исходнике — чистый текст без формулы, весь текст идёт сюда */
  name: string
  /** LaTeX без $-обёртки для выключного режима; пустая строка у чисто текстовых пунктов */
  tex: string
  /** Подгруппа внутри темы, только для темы 11: 'Эллипс', 'Гипербола', 'Парабола', 'Общее уравнение' */
  group?: string
  /** Пояснение мелким шрифтом, если в исходнике есть уточнение после формулы */
  note?: string
}

export interface FormulaTopic {
  /** 1–24 */
  topic: number
  title: string
  formulas: FormulaItem[]
}

/** Обозначения из преамбулы исходника */
export const FORMULA_LEGEND: string = String.raw`$I$ — единичная матрица, $\det A$ — определитель, $\operatorname{rank}A$ — ранг, $\mathbf a,\mathbf b,\mathbf c$ — векторы`

export const FORMULA_TOPICS: FormulaTopic[] = [
  {
    topic: 1,
    title: 'Матрицы: понятие, виды, операции',
    formulas: [
      { id: 'f1-1', name: 'Матрица', tex: String.raw`A=(a_{ij})_{m\times n}` },
      { id: 'f1-2', name: 'Сложение', tex: String.raw`A+B=(a_{ij}+b_{ij})` },
      { id: 'f1-3', name: 'Умножение на число', tex: String.raw`\lambda A=(\lambda a_{ij})` },
      { id: 'f1-4', name: 'Произведение матриц', tex: String.raw`(AB)_{ij}=\sum_{k=1}^{n}a_{ik}b_{kj}` },
      { id: 'f1-5', name: 'Транспонирование', tex: String.raw`(A^T)_{ij}=a_{ji}` },
      { id: 'f1-6', name: 'Единичная матрица', tex: String.raw`AI=IA=A` },
      {
        id: 'f1-7',
        name: 'Свойства',
        tex: String.raw`A(B+C)=AB+AC,\quad (A+B)C=AC+BC,\quad (AB)C=A(BC)`,
        note: String.raw`обычно $AB\ne BA$`,
      },
    ],
  },
  {
    topic: 2,
    title: 'Определители, миноры, алгебраические дополнения',
    formulas: [
      {
        id: 'f2-1',
        name: String.raw`Для $2\times2$`,
        tex: String.raw`\det\begin{pmatrix}a&b\\c&d\end{pmatrix}=ad-bc`,
      },
      {
        id: 'f2-2',
        name: 'Минор',
        tex: String.raw`M_{ij}`,
        note: String.raw`определитель после удаления строки $i$ и столбца $j$`,
      },
      { id: 'f2-3', name: 'Алгебраическое дополнение', tex: String.raw`A_{ij}=(-1)^{i+j}M_{ij}` },
      { id: 'f2-4', name: 'Разложение по строке', tex: String.raw`\det A=\sum_{j=1}^{n}a_{ij}A_{ij}` },
      { id: 'f2-5', name: 'Разложение по столбцу', tex: String.raw`\det A=\sum_{i=1}^{n}a_{ij}A_{ij}` },
      { id: 'f2-6', name: '', tex: String.raw`\det(A^T)=\det A` },
      { id: 'f2-7', name: '', tex: String.raw`\det(AB)=\det A\,\det B` },
      { id: 'f2-8', name: 'Перестановка двух строк меняет знак определителя', tex: '' },
      {
        id: 'f2-9',
        name: String.raw`Умножение строки на $\lambda$ умножает определитель на $\lambda$`,
        tex: '',
      },
      {
        id: 'f2-10',
        name: 'Прибавление к строке другой строки, умноженной на число, не меняет определитель',
        tex: '',
      },
      { id: 'f2-11', name: 'Для треугольной матрицы', tex: String.raw`\det A=\prod_{i=1}^{n}a_{ii}` },
    ],
  },
  {
    topic: 3,
    title: 'СЛАУ: Крамер, обратная матрица',
    formulas: [
      { id: 'f3-1', name: 'Матричная форма', tex: String.raw`AX=B` },
      {
        id: 'f3-2',
        name: String.raw`Формулы Крамера при $\Delta=\det A\ne0$`,
        tex: String.raw`x_i=\frac{\Delta_i}{\Delta}`,
      },
      {
        id: 'f3-3',
        name: String.raw`Обратная матрица существует тогда и только тогда, когда $\det A\ne0$`,
        tex: '',
      },
      { id: 'f3-4', name: '', tex: String.raw`A^{-1}=\frac{1}{\det A}\operatorname{adj}A` },
      { id: 'f3-5', name: '', tex: String.raw`AA^{-1}=A^{-1}A=I` },
      { id: 'f3-6', name: 'Матричное решение СЛАУ', tex: String.raw`X=A^{-1}B` },
    ],
  },
  {
    topic: 4,
    title: 'Ранг матрицы и метод Гаусса',
    formulas: [
      {
        id: 'f4-1',
        name: '',
        tex: String.raw`\operatorname{rank}A`,
        note: 'максимальный порядок ненулевого минора; эквивалентно числу ведущих строк после приведения к ступенчатому виду',
      },
      {
        id: 'f4-2',
        name: 'Допустимые элементарные преобразования строк: перестановка; умножение на ненулевое число; прибавление кратной другой строки',
        tex: '',
      },
      { id: 'f4-3', name: 'Расширенная матрица системы', tex: String.raw`[A\mid B]` },
      {
        id: 'f4-4',
        name: 'Критерий совместности',
        tex: String.raw`\operatorname{rank}A=\operatorname{rank}[A\mid B]`,
      },
      {
        id: 'f4-5',
        name: String.raw`Единственное решение для $n$ неизвестных`,
        tex: String.raw`\operatorname{rank}A=\operatorname{rank}[A\mid B]=n`,
      },
      {
        id: 'f4-6',
        name: 'Бесконечно много решений',
        tex: String.raw`\operatorname{rank}A=\operatorname{rank}[A\mid B]<n`,
      },
    ],
  },
  {
    topic: 5,
    title: 'Векторная алгебра: линейные операции, зависимость, базис',
    formulas: [
      {
        id: 'f5-1',
        name: 'Координатная запись',
        tex: String.raw`\mathbf a=(a_1,a_2,a_3)=a_1\mathbf e_1+a_2\mathbf e_2+a_3\mathbf e_3`,
      },
      { id: 'f5-2', name: '', tex: String.raw`\mathbf a+\mathbf b=(a_1+b_1,a_2+b_2,a_3+b_3)` },
      { id: 'f5-3', name: '', tex: String.raw`\lambda\mathbf a=(\lambda a_1,\lambda a_2,\lambda a_3)` },
      { id: 'f5-4', name: 'Коллинеарность', tex: String.raw`\mathbf a=\lambda\mathbf b` },
      {
        id: 'f5-5',
        name: 'Линейная зависимость',
        tex: String.raw`\lambda_1\mathbf a_1+\cdots+\lambda_k\mathbf a_k=\mathbf0`,
        note: 'имеет нетривиальное решение',
      },
    ],
  },
  {
    topic: 6,
    title: 'Скалярное произведение',
    formulas: [
      { id: 'f6-1', name: '', tex: String.raw`\mathbf a\cdot\mathbf b=a_1b_1+a_2b_2+a_3b_3` },
      { id: 'f6-2', name: '', tex: String.raw`\mathbf a\cdot\mathbf b=|\mathbf a|\,|\mathbf b|\cos\varphi` },
      { id: 'f6-3', name: 'Длина', tex: String.raw`|\mathbf a|=\sqrt{a_1^2+a_2^2+a_3^2}` },
      {
        id: 'f6-4',
        name: 'Угол',
        tex: String.raw`\cos\varphi=\frac{\mathbf a\cdot\mathbf b}{|\mathbf a|\,|\mathbf b|}`,
      },
      { id: 'f6-5', name: 'Ортогональность', tex: String.raw`\mathbf a\cdot\mathbf b=0` },
      {
        id: 'f6-6',
        name: 'Скалярная проекция',
        tex: String.raw`\operatorname{pr}_{\mathbf b}\mathbf a=\frac{\mathbf a\cdot\mathbf b}{|\mathbf b|}`,
      },
      {
        id: 'f6-7',
        name: 'Векторная проекция',
        tex: String.raw`\operatorname{proj}_{\mathbf b}\mathbf a=\frac{\mathbf a\cdot\mathbf b}{|\mathbf b|^2}\mathbf b`,
      },
    ],
  },
  {
    topic: 7,
    title: 'Векторное и смешанное произведения',
    formulas: [
      {
        id: 'f7-1',
        name: '',
        tex: String.raw`\mathbf a\times\mathbf b=\begin{vmatrix}\mathbf i&\mathbf j&\mathbf k\\a_1&a_2&a_3\\b_1&b_2&b_3\end{vmatrix}`,
      },
      { id: 'f7-2', name: '', tex: String.raw`|\mathbf a\times\mathbf b|=|\mathbf a|\,|\mathbf b|\sin\varphi` },
      { id: 'f7-3', name: 'Площадь параллелограмма', tex: String.raw`S_{\parallel}=|\mathbf a\times\mathbf b|` },
      { id: 'f7-4', name: 'Площадь треугольника', tex: String.raw`S_{\triangle}=\frac12|\mathbf a\times\mathbf b|` },
      {
        id: 'f7-5',
        name: 'Смешанное произведение',
        tex: String.raw`[\mathbf a,\mathbf b,\mathbf c]=\mathbf a\cdot(\mathbf b\times\mathbf c)=\det\begin{pmatrix}a_1&a_2&a_3\\b_1&b_2&b_3\\c_1&c_2&c_3\end{pmatrix}`,
      },
      { id: 'f7-6', name: 'Объём параллелепипеда', tex: String.raw`V=|[\mathbf a,\mathbf b,\mathbf c]|` },
      { id: 'f7-7', name: 'Объём тетраэдра', tex: String.raw`V=\frac16|[\mathbf a,\mathbf b,\mathbf c]|` },
      { id: 'f7-8', name: 'Компланарность', tex: String.raw`[\mathbf a,\mathbf b,\mathbf c]=0` },
    ],
  },
  {
    topic: 8,
    title: 'Прямая на плоскости',
    formulas: [
      {
        id: 'f8-1',
        name: 'Общее уравнение',
        tex: String.raw`Ax+By+C=0`,
        note: String.raw`нормаль $\mathbf n=(A,B)$`,
      },
      { id: 'f8-2', name: 'С угловым коэффициентом', tex: String.raw`y=kx+b` },
      {
        id: 'f8-3',
        name: String.raw`Через точку с направляющим вектором $(m,n)$`,
        tex: String.raw`\frac{x-x_0}{m}=\frac{y-y_0}{n}`,
      },
      { id: 'f8-4', name: 'Параметрически', tex: String.raw`x=x_0+mt,\quad y=y_0+nt` },
      {
        id: 'f8-5',
        name: 'Через две точки',
        tex: String.raw`\frac{x-x_1}{x_2-x_1}=\frac{y-y_1}{y_2-y_1}`,
      },
      { id: 'f8-6', name: 'В отрезках', tex: String.raw`\frac{x}{a}+\frac{y}{b}=1` },
      {
        id: 'f8-7',
        name: 'Угол через коэффициенты',
        tex: String.raw`\tan\varphi=\left|\frac{k_2-k_1}{1+k_1k_2}\right|`,
      },
      {
        id: 'f8-8',
        name: String.raw`Расстояние от $(x_0,y_0)$ до $Ax+By+C=0$`,
        tex: String.raw`d=\frac{|Ax_0+By_0+C|}{\sqrt{A^2+B^2}}`,
      },
    ],
  },
  {
    topic: 9,
    title: 'Прямая в пространстве',
    formulas: [
      { id: 'f9-1', name: 'Векторно-параметрически', tex: String.raw`\mathbf r=\mathbf r_0+t\mathbf s` },
      { id: 'f9-2', name: 'Координатно', tex: String.raw`x=x_0+lt,\quad y=y_0+mt,\quad z=z_0+nt` },
      {
        id: 'f9-3',
        name: 'Канонически',
        tex: String.raw`\frac{x-x_0}{l}=\frac{y-y_0}{m}=\frac{z-z_0}{n}`,
      },
      {
        id: 'f9-4',
        name: 'Через две точки: направляющий вектор',
        tex: String.raw`\mathbf s=\overrightarrow{P_1P_2}`,
      },
      {
        id: 'f9-5',
        name: 'Угол между прямыми',
        tex: String.raw`\cos\varphi=\frac{|\mathbf s_1\cdot\mathbf s_2|}{|\mathbf s_1|\,|\mathbf s_2|}`,
      },
      { id: 'f9-6', name: 'Параллельность', tex: String.raw`\mathbf s_1\times\mathbf s_2=\mathbf0` },
      { id: 'f9-7', name: 'Перпендикулярность', tex: String.raw`\mathbf s_1\cdot\mathbf s_2=0` },
    ],
  },
  {
    topic: 10,
    title: 'Плоскость; прямая и плоскость',
    formulas: [
      {
        id: 'f10-1',
        name: 'Общее уравнение',
        tex: String.raw`Ax+By+Cz+D=0`,
        note: String.raw`нормаль $\mathbf n=(A,B,C)$`,
      },
      {
        id: 'f10-2',
        name: String.raw`Через точку $P_0(x_0,y_0,z_0)$`,
        tex: String.raw`A(x-x_0)+B(y-y_0)+C(z-z_0)=0`,
      },
      {
        id: 'f10-3',
        name: 'Через три точки',
        tex: String.raw`\begin{vmatrix}x-x_1&y-y_1&z-z_1\\x_2-x_1&y_2-y_1&z_2-z_1\\x_3-x_1&y_3-y_1&z_3-z_1\end{vmatrix}=0`,
      },
      {
        id: 'f10-4',
        name: 'Угол между плоскостями',
        tex: String.raw`\cos\varphi=\frac{|\mathbf n_1\cdot\mathbf n_2|}{|\mathbf n_1|\,|\mathbf n_2|}`,
      },
      {
        id: 'f10-5',
        name: 'Расстояние от точки',
        tex: String.raw`d=\frac{|Ax_0+By_0+Cz_0+D|}{\sqrt{A^2+B^2+C^2}}`,
      },
      {
        id: 'f10-6',
        name: String.raw`Угол между прямой с направлением $\mathbf s$ и плоскостью с нормалью $\mathbf n$`,
        tex: String.raw`\sin\varphi=\frac{|\mathbf s\cdot\mathbf n|}{|\mathbf s|\,|\mathbf n|}`,
      },
      { id: 'f10-7', name: 'Прямая параллельна плоскости', tex: String.raw`\mathbf s\cdot\mathbf n=0` },
    ],
  },
  {
    topic: 11,
    title: 'Кривые второго порядка',
    formulas: [
      {
        id: 'f11-1',
        name: '',
        tex: String.raw`\frac{x^2}{a^2}+\frac{y^2}{b^2}=1,\quad a>b>0`,
        group: 'Эллипс',
      },
      {
        id: 'f11-2',
        name: '',
        tex: String.raw`c^2=a^2-b^2,\quad e=\frac ca,\quad 0<e<1`,
        group: 'Эллипс',
      },
      { id: 'f11-3', name: 'Фокусы', tex: String.raw`(\pm c,0)`, group: 'Эллипс' },
      {
        id: 'f11-4',
        name: 'Директрисы',
        tex: String.raw`x=\pm\frac{a}{e}=\pm\frac{a^2}{c}`,
        group: 'Эллипс',
      },
      {
        id: 'f11-5',
        name: '',
        tex: String.raw`\frac{x^2}{a^2}-\frac{y^2}{b^2}=1`,
        group: 'Гипербола',
      },
      {
        id: 'f11-6',
        name: '',
        tex: String.raw`c^2=a^2+b^2,\quad e=\frac ca>1`,
        group: 'Гипербола',
      },
      { id: 'f11-7', name: 'Фокусы', tex: String.raw`(\pm c,0)`, group: 'Гипербола' },
      { id: 'f11-8', name: 'Директрисы', tex: String.raw`x=\pm\frac{a}{e}`, group: 'Гипербола' },
      { id: 'f11-9', name: 'Асимптоты', tex: String.raw`y=\pm\frac ba x`, group: 'Гипербола' },
      {
        id: 'f11-10',
        name: 'Фокус',
        tex: String.raw`F\left(\frac p2,0\right)`,
        group: 'Парабола',
        note: String.raw`Используется распространённая в российских курсах форма $y^2=2px$`,
      },
      { id: 'f11-11', name: 'Директриса', tex: String.raw`x=-\frac p2`, group: 'Парабола' },
      {
        id: 'f11-12',
        name: String.raw`Для формы $x^2=2py$ фокус $F\left(0,\frac p2\right)$, директриса $y=-\frac p2$`,
        tex: '',
        group: 'Парабола',
      },
      {
        id: 'f11-13',
        name: '',
        tex: String.raw`Ax^2+Bxy+Cy^2+Dx+Ey+F=0`,
        group: 'Общее уравнение',
      },
      {
        id: 'f11-14',
        name: String.raw`Для невырожденной действительной кривой после приведения: $B^2-4AC<0$ — эллиптический тип; $=0$ — параболический; $>0$ — гиперболический`,
        tex: '',
        group: 'Общее уравнение',
      },
    ],
  },
  {
    topic: 12,
    title: 'Функции, способы задания, обратная и сложная функция',
    formulas: [
      { id: 'f12-1', name: 'Сложная функция', tex: String.raw`(f\circ g)(x)=f(g(x))` },
      {
        id: 'f12-2',
        name: 'Обратная',
        tex: String.raw`f^{-1}(f(x))=x,\quad f(f^{-1}(y))=y`,
        note: 'на соответствующих областях',
      },
      { id: 'f12-3', name: 'Чётная', tex: String.raw`f(-x)=f(x)` },
      { id: 'f12-4', name: 'Нечётная', tex: String.raw`f(-x)=-f(x)` },
    ],
  },
  {
    topic: 13,
    title: 'Числовые последовательности и предел',
    formulas: [
      {
        id: 'f13-1',
        name: String.raw`$\lim_{n\to\infty}a_n=A$ означает`,
        tex: String.raw`\forall\varepsilon>0\ \exists N:\ n>N\Rightarrow|a_n-A|<\varepsilon`,
      },
      { id: 'f13-2', name: '', tex: String.raw`\lim(a_n+b_n)=\lim a_n+\lim b_n` },
      { id: 'f13-3', name: '', tex: String.raw`\lim(a_nb_n)=(\lim a_n)(\lim b_n)` },
      {
        id: 'f13-4',
        name: '',
        tex: String.raw`\lim\frac{a_n}{b_n}=\frac{\lim a_n}{\lim b_n}`,
        note: 'при ненулевом пределе знаменателя',
      },
    ],
  },
  {
    topic: 14,
    title: 'Предел функции',
    formulas: [
      {
        id: 'f14-1',
        name: String.raw`$\lim_{x\to a}f(x)=L$ означает`,
        tex: String.raw`\forall\varepsilon>0\ \exists\delta>0:\ 0<|x-a|<\delta\Rightarrow|f(x)-L|<\varepsilon`,
      },
      {
        id: 'f14-2',
        name: 'Односторонние пределы',
        tex: String.raw`\lim_{x\to a-}f(x),\quad \lim_{x\to a+}f(x)`,
      },
      {
        id: 'f14-3',
        name: 'Двусторонний предел существует тогда и только тогда, когда оба односторонних существуют и равны',
        tex: '',
      },
      { id: 'f14-4', name: 'Предел на бесконечности', tex: String.raw`\lim_{x\to\infty}f(x)=L` },
    ],
  },
  {
    topic: 15,
    title: 'Бесконечно малые и бесконечно большие функции',
    formulas: [
      {
        id: 'f15-1',
        name: String.raw`$\alpha(x)$ бесконечно мала при $x\to a$, если`,
        tex: String.raw`\lim_{x\to a}\alpha(x)=0`,
      },
      {
        id: 'f15-2',
        name: String.raw`$\beta(x)$ бесконечно велика, если`,
        tex: String.raw`|\beta(x)|\to\infty`,
      },
      {
        id: 'f15-3',
        name: '',
        tex: String.raw`\lim_{x\to a}f(x)=A \iff f(x)=A+\alpha(x)`,
        note: String.raw`где $\alpha(x)\to0$`,
      },
      { id: 'f15-4', name: 'Сумма конечного числа бесконечно малых — бесконечно мала', tex: '' },
      {
        id: 'f15-5',
        name: 'Произведение бесконечно малой на ограниченную функцию — бесконечно мало',
        tex: '',
      },
    ],
  },
  {
    topic: 16,
    title: 'Замечательные пределы и эквивалентности',
    formulas: [
      { id: 'f16-1', name: 'Первый замечательный', tex: String.raw`\lim_{x\to0}\frac{\sin x}{x}=1` },
      {
        id: 'f16-2',
        name: 'Второй замечательный',
        tex: String.raw`\lim_{x\to\infty}\left(1+\frac1x\right)^x=e`,
      },
      { id: 'f16-3', name: 'Эквивалентная форма', tex: String.raw`\lim_{x\to0}(1+x)^{1/x}=e` },
      {
        id: 'f16-4',
        name: String.raw`При $x\to0$`,
        tex: String.raw`\sin x\sim x,\quad \tan x\sim x,\quad \arcsin x\sim x,\quad \arctan x\sim x`,
      },
      { id: 'f16-5', name: '', tex: String.raw`1-\cos x\sim\frac{x^2}{2}` },
      { id: 'f16-6', name: '', tex: String.raw`e^x-1\sim x` },
      { id: 'f16-7', name: '', tex: String.raw`\ln(1+x)\sim x` },
      { id: 'f16-8', name: '', tex: String.raw`a^x-1\sim x\ln a` },
      { id: 'f16-9', name: '', tex: String.raw`(1+x)^\alpha-1\sim\alpha x` },
    ],
  },
  {
    topic: 17,
    title: 'Непрерывность и точки разрыва',
    formulas: [
      { id: 'f17-1', name: String.raw`Непрерывность в $a$`, tex: String.raw`\lim_{x\to a}f(x)=f(a)` },
      {
        id: 'f17-2',
        name: 'Через приращения',
        tex: String.raw`\Delta y=f(a+\Delta x)-f(a)\to0`,
        note: String.raw`при $\Delta x\to0$`,
      },
      {
        id: 'f17-3',
        name: 'Устранимый разрыв: конечные односторонние пределы равны, но значение отсутствует или не равно пределу',
        tex: '',
      },
      {
        id: 'f17-4',
        name: 'Разрыв первого рода (скачок): конечные односторонние пределы существуют, но не равны',
        tex: '',
      },
      {
        id: 'f17-5',
        name: 'Разрыв второго рода: хотя бы один односторонний предел не существует или бесконечен',
        tex: '',
      },
    ],
  },
  {
    topic: 18,
    title: 'Производная: определение и смысл',
    formulas: [
      {
        id: 'f18-1',
        name: '',
        tex: String.raw`f'(x_0)=\lim_{\Delta x\to0}\frac{f(x_0+\Delta x)-f(x_0)}{\Delta x}`,
      },
      { id: 'f18-2', name: 'Касательная', tex: String.raw`y-f(x_0)=f'(x_0)(x-x_0)` },
      {
        id: 'f18-3',
        name: String.raw`Нормаль при $f'(x_0)\ne0$`,
        tex: String.raw`y-f(x_0)=-\frac1{f'(x_0)}(x-x_0)`,
      },
      { id: 'f18-4', name: 'Механический смысл', tex: String.raw`v(t)=s'(t),\quad a(t)=s''(t)` },
      { id: 'f18-5', name: '', tex: String.raw`(u+v)'=u'+v'` },
      { id: 'f18-6', name: '', tex: String.raw`(uv)'=u'v+uv'` },
      { id: 'f18-7', name: '', tex: String.raw`\left(\frac uv\right)'=\frac{u'v-uv'}{v^2}` },
    ],
  },
  {
    topic: 19,
    title: 'Сложная и обратная функции; таблица производных',
    formulas: [
      { id: 'f19-1', name: 'Цепное правило', tex: String.raw`(f(g(x)))'=f'(g(x))g'(x)` },
      {
        id: 'f19-2',
        name: 'Обратная функция',
        tex: String.raw`(f^{-1})'(y_0)=\frac1{f'(x_0)}`,
        note: String.raw`где $y_0=f(x_0)$ и $f'(x_0)\ne0$`,
      },
      { id: 'f19-3', name: '', tex: String.raw`(x^\alpha)'=\alpha x^{\alpha-1}` },
      { id: 'f19-4', name: '', tex: String.raw`(e^x)'=e^x` },
      { id: 'f19-5', name: '', tex: String.raw`(a^x)'=a^x\ln a` },
      { id: 'f19-6', name: '', tex: String.raw`(\ln x)'=\frac1x` },
      { id: 'f19-7', name: '', tex: String.raw`(\log_a x)'=\frac1{x\ln a}` },
      { id: 'f19-8', name: '', tex: String.raw`(\sin x)'=\cos x` },
      { id: 'f19-9', name: '', tex: String.raw`(\cos x)'=-\sin x` },
      { id: 'f19-10', name: '', tex: String.raw`(\tan x)'=\frac1{\cos^2x}` },
      { id: 'f19-11', name: '', tex: String.raw`(\cot x)'=-\frac1{\sin^2x}` },
      { id: 'f19-12', name: '', tex: String.raw`(\arcsin x)'=\frac1{\sqrt{1-x^2}}` },
      { id: 'f19-13', name: '', tex: String.raw`(\arccos x)'=-\frac1{\sqrt{1-x^2}}` },
      { id: 'f19-14', name: '', tex: String.raw`(\arctan x)'=\frac1{1+x^2}` },
    ],
  },
  {
    topic: 20,
    title: 'Логарифмическое дифференцирование и неявная функция',
    formulas: [
      {
        id: 'f20-1',
        name: String.raw`Для $y=u(x)^{v(x)}$ при $u(x)>0$`,
        tex: String.raw`\ln y=v\ln u`,
      },
      {
        id: 'f20-2',
        name: 'Производная',
        tex: String.raw`y'=y\left(v'\ln u+v\frac{u'}u\right)`,
      },
      {
        id: 'f20-3',
        name: String.raw`Если $F(x,y)=0$ и $F_y\ne0$, то`,
        tex: String.raw`y'=-\frac{F_x}{F_y}`,
      },
    ],
  },
  {
    topic: 21,
    title: 'Параметрическая функция и производные высших порядков',
    formulas: [
      {
        id: 'f21-1',
        name: String.raw`Если $x=x(t)$, $y=y(t)$, $x'(t)\ne0$, то`,
        tex: String.raw`\frac{dy}{dx}=\frac{y'(t)}{x'(t)}`,
      },
      {
        id: 'f21-2',
        name: '',
        tex: String.raw`\frac{d^2y}{dx^2}=\frac{\frac d{dt}\left(\frac{dy}{dx}\right)}{x'(t)}`,
      },
      { id: 'f21-3', name: '', tex: String.raw`y^{(n)}=\frac{d^ny}{dx^n}` },
    ],
  },
  {
    topic: 22,
    title: 'Дифференциал и приближённые вычисления',
    formulas: [
      { id: 'f22-1', name: '', tex: String.raw`dy=f'(x)\,dx` },
      {
        id: 'f22-2',
        name: '',
        tex: String.raw`\Delta y=dy+o(dx)`,
        note: String.raw`при $dx\to0$`,
      },
      {
        id: 'f22-3',
        name: 'Линейное приближение',
        tex: String.raw`f(x+\Delta x)\approx f(x)+f'(x)\Delta x`,
      },
      {
        id: 'f22-4',
        name: String.raw`При независимой переменной $x$`,
        tex: String.raw`d^2y=f''(x)(dx)^2,\quad d^ny=f^{(n)}(x)(dx)^n`,
      },
    ],
  },
  {
    topic: 23,
    title: 'Теоремы о дифференцируемых функциях',
    formulas: [
      {
        id: 'f23-1',
        name: String.raw`Теорема Ферма: если $x_0$ — внутренняя точка локального экстремума и $f$ дифференцируема в $x_0$, то`,
        tex: String.raw`f'(x_0)=0`,
      },
      {
        id: 'f23-2',
        name: String.raw`Теорема Ролля: если $f\in C[a,b]$, дифференцируема на $(a,b)$ и $f(a)=f(b)$, то`,
        tex: String.raw`\exists c\in(a,b): f'(c)=0`,
      },
      {
        id: 'f23-3',
        name: 'Теорема Лагранжа',
        tex: String.raw`\exists c\in(a,b): f'(c)=\frac{f(b)-f(a)}{b-a}`,
        note: String.raw`при непрерывности на $[a,b]$ и дифференцируемости на $(a,b)$`,
      },
      {
        id: 'f23-4',
        name: 'Теорема Коши',
        tex: String.raw`\frac{f'(c)}{g'(c)}=\frac{f(b)-f(a)}{g(b)-g(a)}`,
        note: 'при выполнении условий теоремы и ненулевых соответствующих знаменателях',
      },
    ],
  },
  {
    topic: 24,
    title: 'Правило Лопиталя',
    formulas: [
      {
        id: 'f24-1',
        name: '',
        tex: String.raw`\displaystyle \lim_{x\to a}\frac{f(x)}{g(x)}=\lim_{x\to a}\frac{f'(x)}{g'(x)}`,
        note: String.raw`Для неопределённостей $0/0$ или $\infty/\infty$, если функции дифференцируемы в проколотой окрестности точки, $g'(x)\ne0$, и существует предел отношения производных, то при стандартных условиях`,
      },
      {
        id: 'f24-2',
        name: 'Правило можно применять повторно, если после дифференцирования снова возникает допустимая неопределённость',
        tex: '',
      },
      {
        id: 'f24-3',
        name: String.raw`$0\cdot\infty$ сводят к отношению`,
        tex: String.raw`fg=\frac f{1/g}`,
        note: String.raw`или $\frac g{1/f}$`,
      },
      {
        id: 'f24-4',
        name: String.raw`$\infty-\infty$ сводят к одной дроби или рационализируют`,
        tex: '',
      },
      {
        id: 'f24-5',
        name: String.raw`Для степенных неопределённостей $1^\infty$, $0^0$, $\infty^0$: если $y=u(x)^{v(x)}$, то`,
        tex: String.raw`\ln y=v(x)\ln u(x)`,
        note: String.raw`после нахождения $L=\lim v\ln u$ получают $\lim y=e^L$`,
      },
    ],
  },
]
