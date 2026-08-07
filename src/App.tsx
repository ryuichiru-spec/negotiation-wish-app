import { useEffect, useState } from 'react'
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
    addSectionTitle('公益組織捐款')

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

useEffect(() => {
  const savedDraft = localStorage.getItem(
    'negotiation-wish-draft',
  )

  if (!savedDraft) {
    return
  }

  try {
    const draft = JSON.parse(savedDraft)

setIsFormOpen(true)

    if (typeof draft.subject === 'string') {
      setSubject(draft.subject)
    }

    if (typeof draft.supplementCount === 'string') {
      setSupplementCount(draft.supplementCount)
    }

    if (typeof draft.templeDonation === 'string') {
      setTempleDonation(draft.templeDonation)
    }

    if (typeof draft.incenseDonation === 'string') {
      setIncenseDonation(draft.incenseDonation)
    }

    if (typeof draft.charityCategory === 'string') {
      setCharityCategory(
        draft.charityCategory as CharityCategory | '',
      )
    }

    if (typeof draft.charityOrganization === 'string') {
      setCharityOrganization(
        draft.charityOrganization,
      )
    }

    if (typeof draft.charityAmount === 'string') {
      setCharityAmount(draft.charityAmount)
    }

    if (
      Array.isArray(draft.scriptures) &&
      draft.scriptures.length > 0
    ) {
      setScriptures(draft.scriptures)
    }

    if (typeof draft.otherConditions === 'string') {
      setOtherConditions(draft.otherConditions)
    }

    if (
      Array.isArray(draft.notes) &&
      draft.notes.length > 0
    ) {
      setNotes(draft.notes)
    }
  } catch {
    console.error('無法讀取已保存的草稿')
  }
}, [])

useEffect(() => {
  const draft = {
    subject,
    supplementCount,
    templeDonation,
    incenseDonation,
    charityCategory,
    charityOrganization,
    charityAmount,
    scriptures,
    otherConditions,
    notes,
  }

  localStorage.setItem(
    'negotiation-wish-draft',
    JSON.stringify(draft),
  )
}, [
  subject,
  supplementCount,
  templeDonation,
  incenseDonation,
  charityCategory,
  charityOrganization,
  charityAmount,
  scriptures,
  otherConditions,
  notes,
])

  return (
    <main>
      <h1>談判許願工具</h1>

      <p>
        記錄與神明洽談的許願、補金、公益捐款、經咒迴向與其他條件。
      </p>

      {!isFormOpen ? (
        <button
          type="button"
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
  <h2>公益組織捐款</h2>

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
    </main>
  )
}

export default App