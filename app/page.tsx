'use client'

import { useState } from 'react'
import styles from './page.module.css'

interface Email {
  id: number
  from: string
  subject: string
  preview: string
  content: string
  date: string
  read: boolean
  starred: boolean
}

export default function Home() {
  const [emails, setEmails] = useState<Email[]>([
    {
      id: 1,
      from: 'maria.gonzalez@ejemplo.com',
      subject: 'Reunión de equipo - Viernes 2pm',
      preview: 'Hola, quería confirmar la reunión del viernes...',
      content: 'Hola,\n\nQuería confirmar la reunión del viernes a las 2pm. ¿Podrías confirmar tu asistencia?\n\nGracias,\nMaría',
      date: '10:30 AM',
      read: false,
      starred: false
    },
    {
      id: 2,
      from: 'juan.perez@empresa.com',
      subject: 'Proyecto Q4 - Actualización',
      preview: 'Adjunto el informe del proyecto del cuarto trimestre...',
      content: 'Estimado equipo,\n\nAdjunto el informe del proyecto del cuarto trimestre. Por favor revisen los documentos adjuntos.\n\nSaludos,\nJuan Pérez',
      date: 'Ayer',
      read: true,
      starred: true
    },
    {
      id: 3,
      from: 'soporte@servicio.com',
      subject: 'Tu solicitud #12345 ha sido actualizada',
      preview: 'Hemos actualizado el estado de tu solicitud...',
      content: 'Estimado cliente,\n\nHemos actualizado el estado de tu solicitud #12345. Nuestro equipo está trabajando en resolver tu problema.\n\nAtentamente,\nEquipo de Soporte',
      date: '15 Ene',
      read: true,
      starred: false
    },
    {
      id: 4,
      from: 'newsletter@noticias.com',
      subject: 'Resumen semanal de noticias',
      preview: 'Las noticias más importantes de la semana...',
      content: 'Bienvenido al resumen semanal,\n\nAquí están las noticias más importantes de esta semana.\n\nGracias por suscribirte.',
      date: '14 Ene',
      read: false,
      starred: false
    }
  ])

  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null)
  const [currentView, setCurrentView] = useState<'inbox' | 'starred' | 'sent'>('inbox')
  const [composing, setComposing] = useState(false)
  const [newEmail, setNewEmail] = useState({ to: '', subject: '', content: '' })

  const handleEmailClick = (email: Email) => {
    setSelectedEmail(email)
    setEmails(emails.map(e =>
      e.id === email.id ? { ...e, read: true } : e
    ))
    setComposing(false)
  }

  const toggleStar = (id: number, e: React.MouseEvent) => {
    e.stopPropagation()
    setEmails(emails.map(email =>
      email.id === id ? { ...email, starred: !email.starred } : email
    ))
  }

  const deleteEmail = (id: number) => {
    setEmails(emails.filter(email => email.id !== id))
    if (selectedEmail?.id === id) {
      setSelectedEmail(null)
    }
  }

  const handleCompose = () => {
    setComposing(true)
    setSelectedEmail(null)
  }

  const handleSendEmail = () => {
    if (newEmail.to && newEmail.subject && newEmail.content) {
      const sentEmail: Email = {
        id: Date.now(),
        from: 'tu@correo.com',
        subject: newEmail.subject,
        preview: newEmail.content.substring(0, 50) + '...',
        content: newEmail.content,
        date: 'Ahora',
        read: true,
        starred: false
      }
      setEmails([sentEmail, ...emails])
      setNewEmail({ to: '', subject: '', content: '' })
      setComposing(false)
      alert('¡Correo enviado exitosamente!')
    }
  }

  const filteredEmails = currentView === 'starred'
    ? emails.filter(e => e.starred)
    : emails

  const unreadCount = emails.filter(e => !e.read).length

  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          <h1>📧 Correo</h1>
        </div>

        <button className={styles.composeBtn} onClick={handleCompose}>
          ✏️ Redactar
        </button>

        <nav className={styles.nav}>
          <button
            className={currentView === 'inbox' ? styles.active : ''}
            onClick={() => setCurrentView('inbox')}
          >
            📥 Bandeja de entrada
            {unreadCount > 0 && <span className={styles.badge}>{unreadCount}</span>}
          </button>
          <button
            className={currentView === 'starred' ? styles.active : ''}
            onClick={() => setCurrentView('starred')}
          >
            ⭐ Destacados
          </button>
          <button
            className={currentView === 'sent' ? styles.active : ''}
            onClick={() => setCurrentView('sent')}
          >
            📤 Enviados
          </button>
        </nav>
      </aside>

      <div className={styles.emailList}>
        <div className={styles.listHeader}>
          <h2>
            {currentView === 'inbox' && 'Bandeja de entrada'}
            {currentView === 'starred' && 'Destacados'}
            {currentView === 'sent' && 'Enviados'}
          </h2>
          <span className={styles.count}>{filteredEmails.length} correos</span>
        </div>

        {filteredEmails.map(email => (
          <div
            key={email.id}
            className={`${styles.emailItem} ${!email.read ? styles.unread : ''} ${selectedEmail?.id === email.id ? styles.selected : ''}`}
            onClick={() => handleEmailClick(email)}
          >
            <button
              className={`${styles.star} ${email.starred ? styles.starred : ''}`}
              onClick={(e) => toggleStar(email.id, e)}
            >
              {email.starred ? '⭐' : '☆'}
            </button>
            <div className={styles.emailInfo}>
              <div className={styles.emailHeader}>
                <strong>{email.from}</strong>
                <span className={styles.date}>{email.date}</span>
              </div>
              <div className={styles.subject}>{email.subject}</div>
              <div className={styles.preview}>{email.preview}</div>
            </div>
          </div>
        ))}

        {filteredEmails.length === 0 && (
          <div className={styles.empty}>
            <p>No hay correos en esta sección</p>
          </div>
        )}
      </div>

      <div className={styles.emailContent}>
        {composing ? (
          <div className={styles.compose}>
            <div className={styles.composeHeader}>
              <h2>Nuevo mensaje</h2>
              <button onClick={() => setComposing(false)} className={styles.closeBtn}>✕</button>
            </div>
            <div className={styles.composeForm}>
              <div className={styles.formGroup}>
                <label>Para:</label>
                <input
                  type="email"
                  value={newEmail.to}
                  onChange={(e) => setNewEmail({ ...newEmail, to: e.target.value })}
                  placeholder="destinatario@ejemplo.com"
                />
              </div>
              <div className={styles.formGroup}>
                <label>Asunto:</label>
                <input
                  type="text"
                  value={newEmail.subject}
                  onChange={(e) => setNewEmail({ ...newEmail, subject: e.target.value })}
                  placeholder="Asunto del correo"
                />
              </div>
              <div className={styles.formGroup}>
                <label>Mensaje:</label>
                <textarea
                  value={newEmail.content}
                  onChange={(e) => setNewEmail({ ...newEmail, content: e.target.value })}
                  placeholder="Escribe tu mensaje aquí..."
                  rows={12}
                />
              </div>
              <div className={styles.composeActions}>
                <button onClick={handleSendEmail} className={styles.sendBtn}>
                  📤 Enviar
                </button>
                <button onClick={() => setComposing(false)} className={styles.cancelBtn}>
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        ) : selectedEmail ? (
          <div className={styles.emailDetail}>
            <div className={styles.detailHeader}>
              <div>
                <h2>{selectedEmail.subject}</h2>
                <div className={styles.detailMeta}>
                  <span><strong>De:</strong> {selectedEmail.from}</span>
                  <span>{selectedEmail.date}</span>
                </div>
              </div>
              <div className={styles.detailActions}>
                <button onClick={() => alert('Responder')} title="Responder">↩️</button>
                <button onClick={() => toggleStar(selectedEmail.id, {} as React.MouseEvent)} title="Destacar">
                  {selectedEmail.starred ? '⭐' : '☆'}
                </button>
                <button onClick={() => deleteEmail(selectedEmail.id)} title="Eliminar">🗑️</button>
              </div>
            </div>
            <div className={styles.detailBody}>
              {selectedEmail.content.split('\n').map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          </div>
        ) : (
          <div className={styles.emptyContent}>
            <div className={styles.emptyIcon}>📧</div>
            <p>Selecciona un correo para leerlo</p>
          </div>
        )}
      </div>
    </div>
  )
}
