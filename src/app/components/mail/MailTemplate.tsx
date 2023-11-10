import React from 'react'

interface MailTemplateProps {
    username: string;
  }

const MailTemplate = ({
   username
} : MailTemplateProps) => {
  return (
    <div>Welcome, {username}</div>
  )
}

export default MailTemplate