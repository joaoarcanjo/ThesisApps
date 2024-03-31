
export const enum FlashMessage {
    //Messages to be used on copyValue function:
    uriCopied = 'URI COPIADO!!',
    usernameCopied = 'UTILIZADOR COPIADO!!',
    passwordCopied = 'PASSWORD COPIADA!!',

    //Messages to be used on editMode:
    editModeActive = 'MODO EDIÇÃO ATIVADO',
    editCredentialCompleted = 'CREDENCIAL ATUALIZADA COM SUCESSO!',
    editPersonalInfoCompleted = 'INFORMAÇÕES PESSOAIS ATUALIZADAS COM SUCESSO!',

    caregiverPersonalInfoUpdated = 'O CUIDADOR ATUALIZOU OS SEUS DADOS PESSOAIS!',

    sessionRequest = 'PEDIDO DE SESSÃO ENVIADO!',
    sessionRequestReceived = 'PEDIDO DE SESSÃO RECEBIDO!',
    sessionEnded = 'RELAÇÃO COM O CUIDADOR TERMINADA!',
    sessionEndedByCaregiver = 'O CUIDADOR TERMINOU A RELAÇÃO!',
    sessionAccepted = 'A CONEXÃO FOI ESTABELECIDA!',
    sessionRejected = 'A CONEXÃO NÃO FOI ESTABELECIDA!',

    caregiverReject = 'O CUIDADOR REJEITOU A CONEXÃO!',
    caregiverAccept = 'O CUIDADOR ACEITOU A CONEXÃO!',
    editModeCanceled = 'MODO EDIÇÃO DESATIVADO',
    credentialUpdated = 'CREDENCIAL ATUALIZADA COM SUCESSO!',

    credentialUpdatedByCaregiver = 'O CUIDADOR ATUALIZOU UMA CREDENCIAL!',
    credentialCreatedByCaregiver = 'O CUIDADOR ADICIONOU UMA CREDENCIAL NOVA!',
    credentialDeletedByCaregiver = 'O CUIDADOR ELIMINOU UMA CREDENCIAL!',

    cantAcceptConnection = 'VOÇÊ NÃO PODE ACEITAR MAIS CONEXÕES!',
    caregiverCantAcceptConnection = 'O CUIDADOR NÃO PODE ACEITAR MAIS CONEXÕES!',
  }
  
  //DESCRIPTIONS:
  /*Descriptions to be used on copyValue function:*/
  export const copyPasswordDescription = `A password foi guardada no clipboard.`
  export const copyUsernameDescription = `O username foi guardado no clipboard.`
  export const copyURIDescription = `O URI foi guardado no clipboard.`

  /*Descriptions to be used on editMode:*/
  export const editModeActiveDescription = `Pense bem antes de realizar qualquer alteração. 🤔`
  export const editModeCanceledDescription = `O modo de edição foi cancelado, as alterações não foram guardadas. ❌`
  export const editCredentialCompletedDescription = `Os dados inseridos foram atualizados com sucesso! 🚀`

  export const caregiverPersonalInfoUpdatedDescription = (caregiverEmail: string) => `O cuidador com o email ${caregiverEmail} atualizou os seus dados pessoais! 😎`

  export const sessionRequestSentDescription = (caregiverEmail: string) => `O pedido de sessão foi enviado com sucesso para o cuidador ${caregiverEmail}! 🚀`

  export const sessionRequestReceivedDescription = (caregiverEmail: string) => `O cuidador com o email ${caregiverEmail} enviou-lhe um pedido de conexão. 💗`

  export const sessionEndedDescription = (caregiverEmail: string) => `A relação com o cuidador ${caregiverEmail} foi terminada! 😢`

  export const sessionAcceptedDescription = (caregiverEmail: string) => `A conexão com o cuidador ${caregiverEmail} foi estabelecida! 🚀`

  export const sessionRejectedDescription = (caregiverEmail: string) => `A conexão com o cuidador ${caregiverEmail} foi rejeitada! ❌`

  export const maxNumberOfConnectionsDescription = (caregiverEmail: string) => `O número máximo de conexões foi atingido, a conexão com o cuidador ${caregiverEmail} foi rejeitada 🚫`

  export const maxNumberOfConnectionsCaregiverDescription = (caregiverEmail: string) => `O número máximo de conexões foi atingido, o cuidador ${caregiverEmail} não pode aceitar mais conexões! 🚫`

  export const credentialUpdatedByCaregiver = (caregiverEmail: string, platform: string) => `O cuidador com o email ${caregiverEmail} atualizou as credenciais de ${platform}! 🔧`

  export const credentialCreatedByCaregiver = (caregiverEmail: string, platform: string) => `O cuidador com o email ${caregiverEmail} adicionou credenciais de ${platform}! ⭐️`

  export const credentialDeletedByCaregiver = (caregiverEmail: string, platform: string) => `O cuidador com o email ${caregiverEmail} eliminou as credenciais de ${platform}! ❌`