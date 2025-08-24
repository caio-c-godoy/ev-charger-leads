// lib/i18n.ts
export type Lang = 'pt' | 'en' | 'es'

/** Detecta o melhor idioma a partir do navegador/Accept-Language */
export function getBestLang(input?: string | string[]): Lang {
  const list = Array.isArray(input) ? input : String(input || '').split(',')
  const norm = (s: string) => s.toLowerCase().trim()
  const has = (p: string) => list.some(l => norm(l).startsWith(p))
  if (has('pt')) return 'pt'
  if (has('es')) return 'es'
  return 'en'
}

export const dictionaries: Record<Lang, Record<string, any>> = {
  pt: {
    // Hero
    title_main: 'EV Charger Installation',
    subtitle_main: 'Receba uma estimativa instantânea e agende com profissionais experientes. Transparência total.',
    feature1: 'Estimativa instantânea (materiais + base labor)',
    feature2: 'Envio por e-mail ou SMS',
    feature3: 'Depoimentos reais e vídeos de instalações',

    // Sections
    section_estimate_title: 'Solicite sua estimativa',
    section_estimate_sub: 'Preencha os dados e envie fotos para agilizar a avaliação.',
    section_testimonials: 'Testimonials',
    section_videos: 'Installation videos',
    section_structure_title: 'Veja nossa estrutura',
    section_structure_sub: 'Fotos do time, ferramentas, veículo e bastidores.',
    section_tips: 'Tips & best practices',
    footer_rights: 'Todos os direitos reservados.',

    // Form
    distance_label: 'Distância do painel ao ponto (ft)',
    charger_model_label: 'Modelo do carregador',
    car_model_label: 'Modelo do carro',
    address_label: 'Endereço (rua/bairro/cidade)',
    address_placeholder: 'Sem número da casa',
    license_pref_label: 'Preferência de profissional',
    experienced_option: 'Profissional experiente (recomendado)',
    licensed_option: 'Eletricista licenciado (quando exigido)',
    license_pref_help: 'Na maioria das residências, o experiente segue o NEC e atende ao código local. Usamos licenciado quando a prefeitura exige ou se você preferir.',

    panel_upload_label: 'Foto do painel elétrico (aberto)',
    btn_take_photo: 'Tirar foto',
    btn_pick_gallery: 'Galeria',
    panel_upload_hint: 'Envie uma foto frontal do painel aberto mostrando claramente os disjuntores.',

    site_upload_label: 'Foto/Vídeo do local da instalação',
    btn_record_video: 'Gravar vídeo',

    email_label: 'Seu e-mail',
    phone_label: 'Seu telefone (SMS)',

    name_label: 'Nome completo',
    name_placeholder: 'Ex.: John Doe',


    btn_view_estimate: 'Ver estimativa',
    btn_send_email: 'Enviar por e-mail',
    btn_send_sms: 'Send SMS',

    toast_email_sent: 'E-mail enviado!',
    toast_sms_sent: 'SMS enviado!',
    toast_error: 'Falha ao enviar. Tente novamente.',

    // Modal (estimate)
    estimate_title: 'Estimate',
    distance: 'Distance (ft)',
    wire_label: 'Wire ($12/ft)',
    breaker_label: 'Breaker (fixed)',
    tube_label: (vars: { units: number }) => `Tube (${vars.units} × $7 each 8ft)`,
    materials_subtotal: 'Materials subtotal',
    labor_label: 'Labor (base)',
    total_estimate: 'Estimated total',
    disclaimer: 'Estimativa automática. O valor poderá sofrer pequenas alterações durante a execução por necessidade de materiais adicionais, ajustes de percurso ou adequações ao código local. Qualquer diferença será combinada antes de prosseguir.',
    disclaimer_action: 'Ao visualizar a estimativa e/ou enviar por e-mail, você reconhece que o valor pode variar conforme condições do local e materiais necessários.',


    // Chat
    chat_button: 'Dúvidas?',
    chat_welcome: 'Olá! Posso ajudar com custos, requisitos e boas práticas para instalar seu carregador.',
    chat_placeholder: 'Escreva sua pergunta...',
    chat_send: 'Enviar',
    chat_typing: 'Digitando...',
    chat_error: 'Não consegui responder agora. Tente novamente.',
    chat_sug_license: 'Diferença: experiente vs. licenciado?',
    chat_sug_photos: 'Quais fotos enviar?',
    chat_sug_time: 'Quanto tempo leva a instalação?',

    // Dicas & Boas práticas
    tips_best_title: 'Boas práticas',
    tips_best_items: [
      'Use circuito dedicado com amperagem adequada ao carregador.',
      'Instale o ponto próximo à vaga e considere o alcance do cabo.',
      'Em áreas expostas, utilize eletroduto/fiação para uso externo.',
      'Identifique o disjuntor do carregador no painel.',
      'Teste a carga com o veículo/app após a instalação.',
    ],
    tips_quick_title: 'Checklist rápido',
    tips_quick_items: [
      'Há espaço livre no painel? (1–2 slots)',
      'Distância aproximada painel→ponto definida',
      'Sinal de Wi-Fi chega ao local do carregador',
      'Foto frontal do painel aberto mostrando os disjuntores',
    ],
    tips_prepare_title: 'Como se preparar',
    tips_prepare_items: [
      'Desobstrua o acesso ao painel e ao local da instalação',
      'Mantenha pets seguros durante o serviço',
      'Se possível, deixe o veículo no local para teste final',
      'Tenha endereço/CEP à mão para verificar exigências do município',
    ],

    schedule_title: 'Agendar instalação',
    schedule_date: 'Data',
    schedule_time: 'Horário preferido',
    schedule_notes: 'Observações',
    schedule_notes_ph: 'Código do portão, informações de estacionamento, etc.',
    schedule_cta: 'Confirmar',
    schedule_success: 'Agendado! Confirmaremos por e-mail.',
    schedule_disclaimer: 'O horário selecionado é um pedido. Confirmaremos a disponibilidade por e-mail. Duração aproximada: 2–3h.',
    sending: 'Enviando...',
    cancel: 'Cancelar',
    btn_back: 'Voltar',
    btn_redo_estimate: 'Refazer estimativa',

  },

  en: {
    title_main: 'EV Charger Installation',
    subtitle_main: 'Get an instant estimate and schedule with experienced professionals. Full transparency.',
    feature1: 'Instant estimate (materials + base labor)',
    feature2: 'Send by email or SMS',
    feature3: 'Real testimonials and installation videos',

    section_estimate_title: 'Request your estimate',
    section_estimate_sub: 'Fill in the info and attach photos to speed up the assessment.',
    section_testimonials: 'Testimonials',
    section_videos: 'Installation videos',
    section_structure_title: 'See our structure',
    section_structure_sub: 'Team, tools, vehicle and behind the scenes.',
    section_tips: 'Tips & best practices',
    footer_rights: 'All rights reserved.',

    distance_label: 'Distance from panel to point (ft)',
    charger_model_label: 'Charger model',
    car_model_label: 'Car model',
    address_label: 'Address (street/neighborhood/city)',
    address_placeholder: 'No house number needed',
    license_pref_label: 'Professional preference',
    experienced_option: 'Experienced professional (recommended)',
    licensed_option: 'Licensed electrician (when required)',
    license_pref_help: 'For most homes, an experienced pro follows NEC and local code. We use a licensed electrician when your city requires it or if you prefer.',

    panel_upload_label: 'Photo of the electrical panel (open)',
    btn_take_photo: 'Take photo',
    btn_pick_gallery: 'Gallery',
    panel_upload_hint: 'Send a straight-on photo of the open panel clearly showing all breakers.',

    site_upload_label: 'Photo/Video of the installation location',
    btn_record_video: 'Record video',

    email_label: 'Your email',
    phone_label: 'Your phone (SMS)',

    name_label: 'Full name',
    name_placeholder: 'e.g., John Doe',

    btn_view_estimate: 'View estimate',
    btn_send_email: 'Send by email',
    btn_send_sms: 'Send SMS',

    toast_email_sent: 'Email sent!',
    toast_sms_sent: 'SMS sent!',
    toast_error: 'Failed to send. Please try again.',

    estimate_title: 'Estimate',
    distance: 'Distance (ft)',
    wire_label: 'Wire ($12/ft)',
    breaker_label: 'Breaker (fixed)',
    tube_label: (vars: { units: number }) => `Tube (${vars.units} × $7 each 8ft)`,
    materials_subtotal: 'Materials subtotal',
    labor_label: 'Labor (base)',
    total_estimate: 'Estimated total',
    disclaimer: 'Automatic estimate. Amount may slightly change during execution due to extra materials, route adjustments or local code requirements. Any difference will be agreed before moving forward.',
    disclaimer_action: 'By viewing the estimate and/or sending by email, you acknowledge the total may vary based on site conditions and required materials.',


    chat_button: 'Questions?',
    chat_welcome: 'Hi! I can help with costs, requirements and best practices for your EV charger install.',
    chat_placeholder: 'Type your question...',
    chat_send: 'Send',
    chat_typing: 'Typing...',
    chat_error: 'I could not reply now. Please try again.',
    chat_sug_license: 'Difference: experienced vs licensed?',
    chat_sug_photos: 'Which photos should I send?',
    chat_sug_time: 'How long does installation take?',

    tips_best_title: 'Best practices',
    tips_best_items: [
      'Use a dedicated circuit sized for the charger amperage.',
      'Place the charger close to the parking spot and mind cable reach.',
      'For exposed runs, use outdoor-rated conduit/wire.',
      'Label the charger breaker in the panel.',
      'Test charging with the vehicle/app after installation.',
    ],
    tips_quick_title: 'Quick checklist',
    tips_quick_items: [
      'Free space in the panel? (1–2 slots)',
      'Approximate panel→charger distance defined',
      'Wi-Fi signal reaches the charger location',
      'Straight-on photo of the open panel showing all breakers',
    ],
    tips_prepare_title: 'Prepare for the visit',
    tips_prepare_items: [
      'Clear access to the panel and installation spot',
      'Keep pets safe during the service window',
      'If possible, have the vehicle available for final test',
      'Have your address/ZIP ready to check city requirements if needed',
    ],

      schedule_title: 'Schedule installation',
      schedule_date: 'Date',
      schedule_time: 'Preferred time',
      schedule_notes: 'Notes',
      schedule_notes_ph: 'Gate code, parking info, etc.',
      schedule_cta: 'Confirm',
      schedule_success: 'Scheduled! We\'ll confirm by email.',
      schedule_disclaimer: 'Selected time is a request. We’ll confirm availability by email. Duration ~2–3h.',
      sending: 'Sending...',
      cancel: 'Cancel',
      btn_back: 'Back',
      btn_redo_estimate: 'Redo estimate',


  },

  es: {
    title_main: 'Instalación de cargador EV',
    subtitle_main: 'Obtén una estimación instantánea y agenda con profesionales con experiencia. Transparencia total.',
    feature1: 'Estimación instantánea (materiales + mano de obra base)',
    feature2: 'Enviar por email o SMS',
    feature3: 'Testimonios reales y videos de instalaciones',

    section_estimate_title: 'Solicita tu estimación',
    section_estimate_sub: 'Completa la info y adjunta fotos para agilizar la evaluación.',
    section_testimonials: 'Testimonios',
    section_videos: 'Videos de instalación',
    section_structure_title: 'Mira nuestra estructura',
    section_structure_sub: 'Equipo, herramientas, vehículo y bastidores.',
    section_tips: 'Consejos y buenas prácticas',
    footer_rights: 'Todos los derechos reservados.',

    distance_label: 'Distancia del panel al punto (ft)',
    charger_model_label: 'Modelo del cargador',
    car_model_label: 'Modelo del auto',
    address_label: 'Dirección (calle/barrio/ciudad)',
    address_placeholder: 'Sin número de casa',
    license_pref_label: 'Preferencia de profesional',
    experienced_option: 'Profesional con experiencia (recomendado)',
    licensed_option: 'Electricista con licencia (cuando sea requerido)',
    license_pref_help: 'Para la mayoría de viviendas, un profesional con experiencia cumple el NEC y la normativa local. Usamos electricista con licencia cuando el municipio lo exige o si lo prefieres.',

    panel_upload_label: 'Foto del panel eléctrico (abierto)',
    btn_take_photo: 'Tomar foto',
    btn_pick_gallery: 'Galería',
    panel_upload_hint: 'Envía una foto frontal del panel abierto mostrando claramente los disyuntores.',

    site_upload_label: 'Foto/Video del lugar de instalación',
    btn_record_video: 'Grabar video',

    email_label: 'Tu email',
    phone_label: 'Tu teléfono (SMS)',

    name_label: 'Nombre completo',
    name_placeholder: 'Ej.: John Doe',

    btn_view_estimate: 'Ver estimación',
    btn_send_email: 'Enviar por email',
    btn_send_sms: 'Enviar SMS',

    toast_email_sent: '¡Email enviado!',
    toast_sms_sent: '¡SMS enviado!',
    toast_error: 'No se pudo enviar. Inténtalo de nuevo.',

    estimate_title: 'Estimación',
    distance: 'Distancia (ft)',
    wire_label: 'Cable ($12/ft)',
    breaker_label: 'Breaker (fijo)',
    tube_label: (vars: { units: number }) => `Tubo (${vars.units} × $7 cada 8ft)`,
    materials_subtotal: 'Subtotal de materiales',
    labor_label: 'Mano de obra (base)',
    total_estimate: 'Total estimado',
    disclaimer: 'Estimación automática. El monto puede cambiar ligeramente durante la ejecución por materiales adicionales, ajustes de recorrido o requisitos del código local. Cualquier diferencia se acordará antes de continuar.',
    disclaimer_action: 'Al ver la estimación y/o enviarla por email, reconoces que el total puede variar según condiciones del sitio y materiales necesarios.',


    chat_button: '¿Dudas?',
    chat_welcome: '¡Hola! Puedo ayudarte con costos, requisitos y buenas prácticas para la instalación.',
    chat_placeholder: 'Escribe tu pregunta...',
    chat_send: 'Enviar',
    chat_typing: 'Escribiendo...',
    chat_error: 'No pude responder ahora. Inténtalo de nuevo.',
    chat_sug_license: 'Diferencia: con experiencia vs. con licencia?',
    chat_sug_photos: '¿Qué fotos envío?',
    chat_sug_time: '¿Cuánto tarda la instalación?',

    tips_best_title: 'Buenas prácticas',
    tips_best_items: [
      'Usa un circuito dedicado dimensionado para el amperaje del cargador.',
      'Coloca el cargador cerca de la plaza y considera el alcance del cable.',
      'Para tramos expuestos, usa tubo/cable para exterior.',
      'Etiqueta el breaker del cargador en el tablero.',
      'Prueba la carga con el vehículo/app después de la instalación.',
    ],
    tips_quick_title: 'Checklist rápido',
    tips_quick_items: [
      '¿Hay espacio libre en el tablero? (1–2 slots)',
      'Distancia aproximada tablero→punto definida',
      'La señal de Wi-Fi llega al lugar del cargador',
      'Foto frontal del tablero abierto mostrando los disyuntores',
    ],
    tips_prepare_title: 'Prepárate para la visita',
    tips_prepare_items: [
      'Despeja el acceso al tablero y al lugar de instalación',
      'Mantén a las mascotas seguras durante el servicio',
      'Si es posible, ten el vehículo disponible para la prueba final',
      'Ten a mano la dirección/Código Postal para verificar requisitos del municipio',
    ],

    schedule_title: 'Programar instalación',
    schedule_date: 'Fecha',
    schedule_time: 'Hora preferida',
    schedule_notes: 'Notas',
    schedule_notes_ph: 'Código de la puerta, información de estacionamiento, etc.',
    schedule_cta: 'Confirmar',
    schedule_success: '¡Programado! Confirmaremos por correo electrónico.',
    schedule_disclaimer: 'La hora seleccionada es una solicitud. Confirmaremos la disponibilidad por correo electrónico. Duración aproximada: 2–3h.',
    sending: 'Enviando...',
    cancel: 'Cancelar',
    btn_back: 'Volver',
    btn_redo_estimate: 'Rehacer estimación',
    
  },
}

// ===== Testimonials dataset (EN / PT / ES) =====
export const testimonialsData = {
  en: [
    {
      name: "Sarah P.",
      location: "Lake Nona, FL",
      rating: 5,
      quote:
        "The team handled everything in a single visit. The estimate shown on the website matched the final invoice. Clean work and the cable is neatly hidden."
    },
    {
      name: "Daniel C.",
      location: "Windermere, FL",
      rating: 5,
      quote:
        "They arrived on time, explained breaker/routing options, and left everything tidy. My Model Y now charges much faster."
    },
    {
      name: "Maria L.",
      location: "Kissimmee, FL",
      rating: 5,
      quote:
        "I sent photos from my phone and got a price in minutes. Scheduling was easy and the installation passed inspection."
    }
  ],
  pt: [
    {
      name: "Sarah P.",
      location: "Lake Nona, FL",
      rating: 5,
      quote:
        "Fizeram tudo em uma única visita. A estimativa do site bateu com a cobrança final. Trabalho limpo e a fiação ficou bem discreta."
    },
    {
      name: "Daniel C.",
      location: "Windermere, FL",
      rating: 5,
      quote:
        "Chegaram no horário, explicaram as opções de disjuntor e trajeto do tubo e deixaram tudo organizado. Meu Model Y agora carrega bem mais rápido."
    },
    {
      name: "Maria L.",
      location: "Kissimmee, FL",
      rating: 5,
      quote:
        "Enviei as fotos pelo celular e recebi o valor em minutos. Agendar foi simples e a instalação passou na inspeção."
    }
  ],
  es: [
    {
      name: "Sarah P.",
      location: "Lake Nona, FL",
      rating: 5,
      quote:
        "Hicieron todo en una sola visita. El presupuesto del sitio coincidió con la factura final. Trabajo limpio y el cableado casi no se ve."
    },
    {
      name: "Daniel C.",
      location: "Windermere, FL",
      rating: 5,
      quote:
        "Llegaron a tiempo, explicaron opciones de breaker y recorrido del tubo, y dejaron todo ordenado. Mi Model Y ahora carga mucho más rápido."
    },
    {
      name: "María L.",
      location: "Kissimmee, FL",
      rating: 5,
      quote:
        "Envié las fotos desde el móvil y recibí el precio en minutos. Programar fue fácil y la instalación pasó la inspección."
    }
  ]
}
export type TestimonialsMap = typeof testimonialsData;
