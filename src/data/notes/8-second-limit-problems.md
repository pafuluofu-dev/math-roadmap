Семь однотипных пределов на второй замечательный предел — тренировочная подборка к теме 16. Все семь решаются одним приёмом: основание приводится к виду $1 + \alpha(x)$ с бесконечно малой $\alpha(x)$, а ответ получается как $e$ в степени предела произведения $\alpha(x)$ на показатель.

> **Второй замечательный предел.** $\displaystyle \lim_{t \to 0}\bigl(1 + t\bigr)^{1/t} = e$, или, что то же самое, $\displaystyle \lim_{x \to \infty}\Bigl(1 + \frac{1}{x}\Bigr)^{x} = e$.
>
> **Рабочая формула.** Если $\alpha(x) \to 0$ и $\alpha(x)\,f(x) \to k$, то $\displaystyle \lim \bigl(1 + \alpha(x)\bigr)^{f(x)} = e^{k}$. Неопределённость здесь одна — $1^{\infty}$; если основание стремится не к единице, второй замечательный предел ни при чём.

---

## Задачи

Найти пределы через второй замечательный предел.

1. $\displaystyle \lim_{x\to+\infty}\left(\frac{x}{x+2}\right)^x$
2. $\displaystyle \lim_{x\to+\infty}\left(\frac{x+3}{x}\right)^x$
3. $\displaystyle \lim_{x\to+\infty}\left(\frac{x-2}{x+1}\right)^x$
4. $\displaystyle \lim_{x\to+\infty}\left(\frac{2x+1}{2x+3}\right)^x$
5. $\displaystyle \lim_{x\to+\infty}\left(\frac{x+2}{x+5}\right)^{2x}$
6. $\displaystyle \lim_{x\to+\infty}\left(\frac{3x+2}{3x-1}\right)^{2x-5}$
7. $\displaystyle \lim_{x\to+\infty}\left(\frac{x^2+1}{x^2+4}\right)^{x^2}$

---

## Приём

Для дроби $\dfrac{P(x)}{Q(x)}$ с одинаковыми старшими членами выделяем единицу:
$$\frac{P}{Q} = 1 + \frac{P - Q}{Q}, \qquad \alpha(x) = \frac{P - Q}{Q} \to 0.$$
Тогда
$$\lim \left(\frac{P}{Q}\right)^{f(x)} = e^{\,k}, \qquad k = \lim \frac{(P - Q)\, f(x)}{Q}.$$
Число $k$ — предел отношения многочленов: делим числитель и знаменатель на старшую степень $x$.

Проверка на здравый смысл: если $P - Q < 0$, основание чуть меньше единицы, и ответ $e^{k}$ с $k < 0$ — число меньше единицы. Если основание чуть больше единицы — $k > 0$.

---

## Решения

### 1

$\dfrac{x}{x+2} = 1 - \dfrac{2}{x+2}$, то есть $\alpha(x) = -\dfrac{2}{x+2}$, показатель $f(x) = x$.

$$k = \lim_{x\to+\infty} \frac{-2x}{x+2} = -2, \qquad \lim_{x\to+\infty}\left(\frac{x}{x+2}\right)^x = e^{-2}.$$

### 2

$\dfrac{x+3}{x} = 1 + \dfrac{3}{x}$, показатель $x$.

$$k = \lim_{x\to+\infty} \frac{3x}{x} = 3, \qquad \lim_{x\to+\infty}\left(\frac{x+3}{x}\right)^x = e^{3}.$$

### 3

$\dfrac{x-2}{x+1} = 1 - \dfrac{3}{x+1}$, показатель $x$.

$$k = \lim_{x\to+\infty} \frac{-3x}{x+1} = -3, \qquad \lim_{x\to+\infty}\left(\frac{x-2}{x+1}\right)^x = e^{-3}.$$

### 4

$\dfrac{2x+1}{2x+3} = 1 - \dfrac{2}{2x+3}$, показатель $x$.

$$k = \lim_{x\to+\infty} \frac{-2x}{2x+3} = -1, \qquad \lim_{x\to+\infty}\left(\frac{2x+1}{2x+3}\right)^x = e^{-1} = \frac{1}{e}.$$

### 5

$\dfrac{x+2}{x+5} = 1 - \dfrac{3}{x+5}$, показатель $2x$ — множитель $2$ уходит в $k$.

$$k = \lim_{x\to+\infty} \frac{-3 \cdot 2x}{x+5} = -6, \qquad \lim_{x\to+\infty}\left(\frac{x+2}{x+5}\right)^{2x} = e^{-6}.$$

### 6

$\dfrac{3x+2}{3x-1} = 1 + \dfrac{3}{3x-1}$, показатель $2x - 5$.

$$k = \lim_{x\to+\infty} \frac{3\,(2x-5)}{3x-1} = \lim_{x\to+\infty} \frac{6x - 15}{3x - 1} = 2, \qquad \lim_{x\to+\infty}\left(\frac{3x+2}{3x-1}\right)^{2x-5} = e^{2}.$$

### 7

$\dfrac{x^2+1}{x^2+4} = 1 - \dfrac{3}{x^2+4}$, показатель $x^2$.

$$k = \lim_{x\to+\infty} \frac{-3x^2}{x^2+4} = -3, \qquad \lim_{x\to+\infty}\left(\frac{x^2+1}{x^2+4}\right)^{x^2} = e^{-3}.$$

---

## Ответы

| № | Предел | $\alpha(x)$ | $k$ | Ответ |
|---|--------|-------------|-----|-------|
| 1 | $\left(\frac{x}{x+2}\right)^x$ | $-\frac{2}{x+2}$ | $-2$ | $e^{-2}$ |
| 2 | $\left(\frac{x+3}{x}\right)^x$ | $\frac{3}{x}$ | $3$ | $e^{3}$ |
| 3 | $\left(\frac{x-2}{x+1}\right)^x$ | $-\frac{3}{x+1}$ | $-3$ | $e^{-3}$ |
| 4 | $\left(\frac{2x+1}{2x+3}\right)^x$ | $-\frac{2}{2x+3}$ | $-1$ | $e^{-1}$ |
| 5 | $\left(\frac{x+2}{x+5}\right)^{2x}$ | $-\frac{3}{x+5}$ | $-6$ | $e^{-6}$ |
| 6 | $\left(\frac{3x+2}{3x-1}\right)^{2x-5}$ | $\frac{3}{3x-1}$ | $2$ | $e^{2}$ |
| 7 | $\left(\frac{x^2+1}{x^2+4}\right)^{x^2}$ | $-\frac{3}{x^2+4}$ | $-3$ | $e^{-3}$ |

---

## Частые ошибки

- Не проверить, что основание стремится к единице. Для $\left(\frac{2x+1}{x+3}\right)^x$ основание $\to 2$, и предел равен $+\infty$ безо всякого $e$.
- Потерять множитель из показателя: в задаче 5 показатель $2x$, поэтому $k = -6$, а не $-3$; в задаче 6 сдвиг $-5$ в показателе на $k$ не влияет, а множитель $2$ — влияет.
- Перепутать знак: знак $k$ совпадает со знаком $P - Q$. Основание $\frac{x}{x+2}$ меньше единицы, значит ответ $e^{-2} < 1$, а не $e^{2}$.
