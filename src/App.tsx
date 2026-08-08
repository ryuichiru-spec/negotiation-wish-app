import { useState } from 'react'
import { charityOrganizations } from './data/charityOrganizations'

type CharityCategory = keyof typeof charityOrganizations

function App() {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [subject, setSubject] = useState('')
  const [supplementCount, setSupplementCount] = useState('')
  const [templeDonation, setTempleDonation] = useState('')
  const [incenseDonation, setIncenseDonation] = useState('')
  const [charityCategory, setCharityCategory] =
  useState<CharityCategory | ''>('')

  const [charityOrganization, setCharityOrganization] = useState('')

const [charityAmount, setCharityAmount] = useState('')

const [scriptures, setScriptures] = useState([
  {
    id: crypto.randomUUID(),
    name: '',
    count: '',
    days: '',
  },
])
const [otherConditions, setOtherConditions] = useState('')

const [notes, setNotes] = useState([
  {
    id: crypto.randomUUID(),
    content: '',
  },
])

const [showPreview, setShowPreview] = useState(false)

  const supplementOptions = Array.from(
    { length: 20 },
    (_, index) => index + 1,
  )

  const donationOptions = Array.from(
    { length: 20 },
    (_, index) => (index + 1) * 100,
  )

  const charityCategories =
  Object.keys(charityOrganizations) as CharityCategory[]

  const organizationOptions = charityCategory
  ? charityOrganizations[charityCategory]
  : []

const updateScripture = (
  id: string,
  field: 'name' | 'count' | 'days',
  value: string,
) => {
  setScriptures((currentScriptures) =>
    currentScriptures.map((scripture) =>
      scripture.id === id
        ? {
            ...scripture,
            [field]: value,
          }
        : scripture,
    ),
  )
}

const addScripture = () => {
  setScriptures((currentScriptures) => [
    ...currentScriptures,
    {
      id: crypto.randomUUID(),
      name: '',
      count: '',
      days: '',
    },
  ])
}

const removeScripture = (id: string) => {
  setScriptures((currentScriptures) =>
    currentScriptures.filter(
      (scripture) => scripture.id !== id,
    ),
  )
}

const updateNote = (
  id: string,
  value: string,
) => {
  setNotes((currentNotes) =>
    currentNotes.map((note) =>
      note.id === id
        ? {
            ...note,
            content: value,
          }
        : note,
    ),
  )
}

const addNote = () => {
  setNotes((currentNotes) => [
    ...currentNotes,
    {
      id: crypto.randomUUID(),
      content: '',
    },
  ])
}

const removeNote = (id: string) => {
  setNotes((currentNotes) =>
    currentNotes.filter(
      (note) => note.id !== id,
    ),
  )
}

const generatePreviewText = () => {
  const lines: string[] = []

  const sectionNumbers = [
    '一',
    '二',
    '三',
    '四',
    '五',
    '六',
    '七',
    '八',
    '九',
    '十',
  ]

  let sectionIndex = 0

  const addSectionTitle = (title: string) => {
    const number =
      sectionNumbers[sectionIndex] ??
      String(sectionIndex + 1)

    lines.push('')
    lines.push(`${number}、${title}`)

    sectionIndex += 1
  }

  lines.push('【許願談判紀錄】')

  if (subject.trim()) {
    lines.push('')
    lines.push(`事由主題：${subject.trim()}`)
  }

  const templeLines: string[] = []

  if (supplementCount) {
    templeLines.push(`補金：${supplementCount} 份`)
  }

  if (templeDonation) {
    templeLines.push(
      `廟內布施：${Number(
        templeDonation,
      ).toLocaleString('zh-TW')} 元`,
    )
  }

  if (incenseDonation) {
    templeLines.push(
      `廟內香油錢：${Number(
        incenseDonation,
      ).toLocaleString('zh-TW')} 元`,
    )
  }

  if (templeLines.length > 0) {
    addSectionTitle('廟內條件')
    lines.push(...templeLines)
  }

  if (
    charityCategory &&
    charityOrganization &&
    charityAmount
  ) {
    addSectionTitle('7-11 ibon 公益組織捐款')

    lines.push(`公益類別：${charityCategory}`)
    lines.push(`公益單位：${charityOrganization}`)
    lines.push(
      `捐款金額：${Number(
        charityAmount,
      ).toLocaleString('zh-TW')} 元`,
    )
  }

  const filledScriptures = scriptures.filter(
    (scripture) =>
      scripture.name.trim() ||
      scripture.count ||
      scripture.days,
  )

  if (filledScriptures.length > 0) {
    addSectionTitle('唸經咒迴向')

    filledScriptures.forEach(
      (scripture, index) => {
        lines.push('')
        lines.push(
          `${index + 1}. 經咒名稱：${
            scripture.name.trim() || '未填寫'
          }`,
        )

        if (scripture.count) {
          lines.push(
            `   次數：${scripture.count} 次`,
          )
        }

        if (scripture.days) {
          lines.push(
            `   天數：${scripture.days} 天`,
          )
        }
      },
    )
  }

  if (otherConditions.trim()) {
    addSectionTitle('其他條件')
    lines.push(otherConditions.trim())
  }

  const filledNotes = notes.filter(
    (note) => note.content.trim(),
  )

  if (filledNotes.length > 0) {
    addSectionTitle('備註')

    filledNotes.forEach((note, index) => {
      lines.push(
        `${index + 1}. ${note.content.trim()}`,
      )
    })
  }

  return lines.join('\n')
}

const copyPreviewText = async () => {
  const text = generatePreviewText()

  try {
    await navigator.clipboard.writeText(text)
    window.alert('整理內容已複製')
  } catch {
    window.alert('複製失敗，請手動選取預覽文字')
  }
}

  return (
    <main>
      <h1>神明許願、冤親和解條件紀錄工具</h1>

      <p>
        記錄與神明洽談的許願、補金、公益捐款、經咒迴向與其他條件。
      </p>

<section className="usage-guide">
  <h2>使用說明</h2>

  <div className="usage-guide-group">
    <p>
      一、此工具用於向神明許願、祈請幫忙或洽談和解時，紀錄支付條件，使用時機如下：
    </p>

    <ol>
      <li>
        向神明許願，神明應允幫忙後詢問是否需支付特定條件或還願條件。
      </li>
      <li>
        向神明許願，神明不應允幫忙，詢問是否可透過支付某些條件獲得應允。
      </li>
      <li>
        確認有冤親債主問題時，確認和解條件。
      </li>
    </ol>
  </div>

  <div className="usage-guide-group">
    <p>
      二、下列條件並非全部都需詢問，可自行挑選詢問順序，補充說明如下：
    </p>

    <ol>
      <li>
        向神明確認項目得聖筊後才詢問支付數量。
      </li>
      <li>
        確認完一項支付條件後，須確認是否有其他支付條件。
      </li>
      <li>
        不懂如何問，可逐一詢問是否需要。
      </li>
      <li>
        待確認無其他支付條件或全部皆問完後，可預覽內容，再次向神尊詢問是否能藉此完成請託或和解案件。
      </li>
      <li>
        如最終確認無獲得聖筊，可詢問是否需要增加其他支付項目。
      </li>
    </ol>
  </div>
</section>

      {!isFormOpen ? (
        <button
          type="button"
          className="start-record-button"
          onClick={() => setIsFormOpen(true)}
        >
          建立新的許願紀錄
        </button>
      ) : (
        <>
          <section>
            <h2>建立許願紀錄</h2>

            <label htmlFor="subject">
              事由主題
            </label>

            <input
              id="subject"
              type="text"
              value={subject}
              onChange={(event) => setSubject(event.target.value)}
              placeholder="例如：工作轉職、感情發展、健康祈願"
            />
          </section>

          <section>
            <h2>廟內條件</h2>

            <label htmlFor="supplementCount">
              補金
            </label>

            <select
              id="supplementCount"
              value={supplementCount}
              onChange={(event) =>
                setSupplementCount(event.target.value)
              }
            >
              <option value="">尚未設定</option>

              {supplementOptions.map((count) => (
                <option
                  key={count}
                  value={count}
                >
                  {count} 份
                </option>
              ))}
            </select>

            <label htmlFor="templeDonation">
              廟內布施
            </label>

            <select
              id="templeDonation"
              value={templeDonation}
              onChange={(event) =>
                setTempleDonation(event.target.value)
              }
            >
              <option value="">尚未設定</option>

              {donationOptions.map((amount) => (
                <option
                  key={amount}
                  value={amount}
                >
                  {amount.toLocaleString('zh-TW')} 元
                </option>
              ))}
            </select>

            <label htmlFor="incenseDonation">
              廟內香油錢
            </label>

            <select
              id="incenseDonation"
              value={incenseDonation}
              onChange={(event) =>
                setIncenseDonation(event.target.value)
              }
            >
              <option value="">尚未設定</option>

              {donationOptions.map((amount) => (
                <option
                  key={amount}
                  value={amount}
                >
                  {amount.toLocaleString('zh-TW')} 元
                </option>
              ))}
            </select>
          </section>
          <section>
  <h2>7-11 ibon 公益組織捐款</h2>

  <label htmlFor="charityCategory">
    公益類別
  </label>

  <select
  id="charityCategory"
  value={charityCategory}
  onChange={(event) => {
    const nextCategory =
      event.target.value as CharityCategory | ''

    setCharityCategory(nextCategory)
    setCharityOrganization('')
    setCharityAmount('')
  }}
>
    <option value="">
      請選擇公益類別
    </option>

    {charityCategories.map((category) => (
      <option
        key={category}
        value={category}
      >
        {category}
      </option>
    ))}
  </select>
  <label htmlFor="charityOrganization">
  公益單位
</label>

<select
  id="charityOrganization"
  value={charityOrganization}
  disabled={!charityCategory}
  onChange={(event) => {
  setCharityOrganization(event.target.value)
  setCharityAmount('')
}}
>
  <option value="">
    {charityCategory
      ? '請選擇公益單位'
      : '請先選擇公益類別'}
  </option>

  {organizationOptions.map((organization) => (
    <option
      key={organization}
      value={organization}
    >
      {organization}
    </option>
  ))}
</select>
<label htmlFor="charityAmount">
  捐款金額
</label>

<select
  id="charityAmount"
  value={charityAmount}
  disabled={!charityOrganization}
  onChange={(event) =>
    setCharityAmount(event.target.value)
  }
>
  <option value="">
    {charityOrganization
      ? '尚未設定'
      : '請先選擇公益單位'}
  </option>

  {donationOptions.map((amount) => (
    <option
      key={amount}
      value={amount}
    >
      {amount.toLocaleString('zh-TW')} 元
    </option>
  ))}
</select>
</section>
<section>
  <h2>唸經咒迴向</h2>

  {scriptures.map((scripture, index) => (
  <div
    key={scripture.id}
    className="scripture-item"
  >
      <h3>
        經咒 {index + 1}
      </h3>

      <label htmlFor={`scriptureName-${scripture.id}`}>
        經咒名稱
      </label>

      <input
        id={`scriptureName-${scripture.id}`}
        type="text"
        value={scripture.name}
        onChange={(event) =>
          updateScripture(
            scripture.id,
            'name',
            event.target.value,
          )
        }
        placeholder="例如：心經、大悲咒"
      />

      <label htmlFor={`scriptureCount-${scripture.id}`}>
        次數
      </label>

      <input
        id={`scriptureCount-${scripture.id}`}
        type="number"
        inputMode="numeric"
        min="1"
        value={scripture.count}
        onChange={(event) =>
          updateScripture(
            scripture.id,
            'count',
            event.target.value,
          )
        }
        placeholder="例如：108"
      />

      <label htmlFor={`scriptureDays-${scripture.id}`}>
        天數
      </label>

      <input
        id={`scriptureDays-${scripture.id}`}
        type="number"
        inputMode="numeric"
        min="1"
        value={scripture.days}
        onChange={(event) =>
          updateScripture(
            scripture.id,
            'days',
            event.target.value,
          )
        }
        placeholder="例如：49"
      />
      {scriptures.length > 1 && (
  <button
  type="button"
  className="scripture-remove-button"
  onClick={() => removeScripture(scripture.id)}
>
  刪除此組經咒
</button>
)}
    </div>
  ))}

  <button
  type="button"
  className="scripture-add-button"
  onClick={addScripture}
>
  ＋ 新增經咒
</button>
</section>
<section>
  <h2>其他條件</h2>

  <label htmlFor="otherConditions">
    其他支付或許願條件
  </label>

  <textarea
    id="otherConditions"
    value={otherConditions}
    onChange={(event) =>
      setOtherConditions(event.target.value)
    }
    placeholder="例如：吃素、不吃牛肉、願望達成後追加公益捐款，或其他與神明洽談的條件"
    rows={5}
  />
</section>
<section>
  <h2>備註</h2>

  {notes.map((note, index) => (
    <div
  key={note.id}
  className="note-item"
>
      <label htmlFor={`note-${note.id}`}>
        備註 {index + 1}
      </label>

      <textarea
        id={`note-${note.id}`}
        value={note.content}
        onChange={(event) =>
          updateNote(
            note.id,
            event.target.value,
          )
        }
        placeholder="問事過程中如有需要記載的內容，可填寫於此"
        rows={4}
      />
      {notes.length > 1 && (
  <button
    type="button"
    className="note-remove-button"
    onClick={() => removeNote(note.id)}
  >
    刪除此筆備註
  </button>
)}
    </div>
  ))}

  <button
    type="button"
    className="note-add-button"
    onClick={addNote}
  >
    ＋ 新增備註
  </button>
</section>
<section>
  <h2>整理與輸出</h2>

  <div className="output-actions">
    <button
      type="button"
      className="preview-toggle-button"
      onClick={() => setShowPreview(!showPreview)}
    >
      {showPreview
        ? '收起預覽'
        : '預覽整理內容'}
    </button>

    <button
      type="button"
      className="copy-output-button"
      onClick={copyPreviewText}
    >
      複製整理內容
    </button>
  </div>

  {showPreview && (
    <div className="preview-box">
      <pre>{generatePreviewText()}</pre>
    </div>
  )}
</section>
        </>
      )}
    <footer className="social-footer">
  <p className="social-footer-title">
    小嚕社群連結
  </p>

  <div className="social-links">
    <a
      href="https://www.threads.net/@ryuichiru"
      target="_blank"
      rel="noopener noreferrer"
      className="social-link-button"
    >
      Threads
    </a>

    <a
      href="https://www.instagram.com/ryuichiru/"
      target="_blank"
      rel="noopener noreferrer"
      className="social-link-button"
    >
      Instagram
    </a>
  </div>
</footer>
    </main>
  )
}

export default App