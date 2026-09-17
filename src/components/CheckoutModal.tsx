import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  X,
  CreditCard,
  CheckCircle2,
  Copy,
  Check,
  Upload,
  MessageCircle,
  Truck,
  ShieldCheck,
  AlertCircle,
  PackageCheck,
  Smartphone,
  Building2,
  Sparkles,
  QrCode,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { PaymentMethod, Order } from '../types';
import { PAYMENT_DETAILS, STORE_PHONE, STORE_PHONE_INTL, STORE_OWNER_NAME } from '../data/initialData';
import { YapeQrCard } from './YapeQrCard';

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cart,
    cartTotal,
    createOrder,
    lastCreatedOrder,
    setLastCreatedOrder,
    getWhatsAppOrderUrl,
    setIsOrderTrackerOpen,
  } = useStore();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('yape');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [documentType, setDocumentType] = useState<'DNI' | 'RUC' | 'CE'>('DNI');
  const [documentNumber, setDocumentNumber] = useState('');
  const [department, setDepartment] = useState('Lima');
  const [province, setProvince] = useState('Lima');
  const [district, setDistrict] = useState('');
  const [address, setAddress] = useState('');
  const [reference, setReference] = useState('');
  const [notes, setNotes] = useState('');

  // Payment proof details
  const [operationCode, setOperationCode] = useState('');
  const [voucherPreview, setVoucherPreview] = useState<string | null>(null);

  // Form errors
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isCheckoutOpen) return null;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(id);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setVoucherPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim()) {
      setErrorMsg('Por favor ingresa tu nombre completo.');
      return;
    }
    if (!phone.trim() || phone.length < 8) {
      setErrorMsg('Por favor ingresa un número de teléfono/WhatsApp válido.');
      return;
    }
    if (!documentNumber.trim()) {
      setErrorMsg('Por favor ingresa tu número de DNI o documento.');
      return;
    }
    if (!address.trim()) {
      setErrorMsg('Por favor ingresa tu dirección exacta de entrega.');
      return;
    }
    if (!district.trim()) {
      setErrorMsg('Por favor ingresa tu distrito.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Create order in automated state and database
      const newOrder = createOrder({
        customer: {
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim(),
          documentType,
          documentNumber: documentNumber.trim(),
          department,
          province: province.trim() || department,
          district: district.trim(),
          address: address.trim(),
          reference: reference.trim(),
        },
        items: cart.map((item) => ({
          productId: item.product.id,
          productName: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          image: item.product.image,
          selectedVariant: item.selectedVariant,
        })),
        subtotal: cartTotal,
        shippingFee: 0,
        discount: 0,
        total: cartTotal,
        paymentMethod,
        paymentStatus: operationCode.trim() ? 'por_verificar' : 'pendiente',
        paymentReference: operationCode.trim() || undefined,
        status: 'recibido',
        notes: notes.trim() || (voucherPreview ? 'Comprobante adjunto cargado' : undefined),
      });

      // Launch victory celebratory confetti
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#be3e57', '#d4af37', '#742284', '#00d3b8'],
        });
      } catch (err) {
        console.log(err);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Ocurrió un error al procesar el pedido. Intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsCheckoutOpen(false);
    setLastCreatedOrder(null);
  };

  // If order was just created, show receipt view
  if (lastCreatedOrder) {
    return (
      <div
        id="order-success-modal-overlay"
        className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
      >
        <div
          id="order-success-card"
          className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative my-auto animate-in zoom-in-95 duration-200 border border-rose-100"
        >
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-full bg-rose-50 text-[#8d253c] flex items-center justify-center mx-auto mb-2 ring-4 ring-rose-100">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <span className="bg-rose-50 text-[#8d253c] text-xs font-bold px-3 py-1 rounded-full border border-rose-200">
              ¡Pedido Registrado con Éxito en Valdivia Joyas!
            </span>
            <h2 className="text-2xl font-['Playfair_Display',serif] font-bold text-neutral-900 tracking-tight">
              ¡Gracias por tu preferencia, {lastCreatedOrder.customer.name.split(' ')[0]}!
            </h2>
            <p className="text-xs text-neutral-500">
              Hemos registrado tu pedido y descontado automáticamente el stock en almacén.
            </p>
          </div>

          {/* Ticket Box */}
          <div className="mt-5 p-4 rounded-2xl bg-rose-50/40 border border-rose-100 space-y-3 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-rose-200/70">
              <div>
                <p className="text-neutral-500 text-[10px] uppercase font-semibold">CÓDIGO DE PEDIDO</p>
                <p className="font-mono font-black text-sm text-[#8d253c]">#{lastCreatedOrder.id}</p>
              </div>
              <div className="text-right">
                <p className="text-neutral-500 text-[10px] uppercase font-semibold">TOTAL A PAGAR</p>
                <p className="font-bold text-base text-neutral-900 font-mono">S/ {lastCreatedOrder.total.toFixed(2)}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div>
                <span className="text-neutral-500">Método de Pago:</span>
                <p className="font-semibold uppercase text-neutral-800">{lastCreatedOrder.paymentMethod}</p>
              </div>
              <div>
                <span className="text-neutral-500">Destino:</span>
                <p className="font-semibold text-neutral-800">
                  {lastCreatedOrder.customer.district}, {lastCreatedOrder.customer.department}
                </p>
              </div>
            </div>

            {/* Items summary */}
            <div className="pt-2 border-t border-rose-200/70">
              <p className="text-neutral-500 text-[10px] uppercase font-bold mb-1">Joyas Solicitadas:</p>
              <ul className="space-y-1">
                {lastCreatedOrder.items.map((item, idx) => (
                  <li key={idx} className="flex justify-between text-[11px] text-neutral-700">
                    <span className="truncate max-w-[280px]">
                      {item.quantity}x {item.productName}
                    </span>
                    <span className="font-semibold font-mono">S/ {(item.price * item.quantity).toFixed(2)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Action buttons */}
          <div className="mt-6 space-y-2.5">
            {/* Direct WhatsApp Confirmation Button */}
            <a
              id="btn-confirm-order-whatsapp"
              href={getWhatsAppOrderUrl(lastCreatedOrder)}
              target="_blank"
              rel="noreferrer"
              className="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm flex items-center justify-center space-x-2 shadow-lg transition-all"
            >
              <MessageCircle className="w-5 h-5 fill-white" />
              <span>ENVIAR COMPROBANTE POR WHATSAPP AL {STORE_PHONE}</span>
            </a>

            <div className="grid grid-cols-2 gap-2">
              <button
                id="btn-track-from-success"
                onClick={() => {
                  handleClose();
                  setIsOrderTrackerOpen(true);
                }}
                className="py-2.5 px-3 rounded-xl border border-rose-200 text-neutral-700 hover:bg-rose-50 font-semibold text-xs flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
              >
                <PackageCheck className="w-4 h-4 text-[#8d253c]" />
                <span>Rastrear Pedido</span>
              </button>

              <button
                id="btn-close-success-modal"
                onClick={handleClose}
                className="py-2.5 px-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-xs transition-colors cursor-pointer"
              >
                Seguir Comprando
              </button>
            </div>
          </div>

          <p className="mt-4 text-center text-[11px] text-neutral-400">
            {STORE_OWNER_NAME} preparará tu pedido con estuche de regalo y te notificará por WhatsApp ({STORE_PHONE}).
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      id="checkout-modal-overlay"
      className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
      onClick={handleClose}
    >
      <div
        id="checkout-modal-content"
        className="bg-white rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl relative my-auto animate-in zoom-in-95 duration-200 border border-rose-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#6e182f] via-[#942944] to-[#b33956] text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-full bg-white text-[#8d253c] flex items-center justify-center font-bold text-xs shadow-md">
              <Sparkles className="w-4 h-4 text-amber-500" />
            </div>
            <div>
              <h3 className="font-['Playfair_Display',serif] font-bold text-base sm:text-lg text-white leading-tight">
                Finalizar Compra en Valdivia Joyas
              </h3>
              <p className="text-xs text-rose-200">
                Pagos seguros con Yape (QR), Plin y Transferencias Bancarias
              </p>
            </div>
          </div>
          <button
            id="btn-close-checkout"
            onClick={handleClose}
            className="p-1 rounded-lg text-rose-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmitOrder} className="p-4 sm:p-6 overflow-y-auto max-h-[82vh]">
          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Customer & Shipping Details (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center space-x-2 text-neutral-900 font-bold text-sm border-b border-rose-100 pb-2">
                <Truck className="w-4 h-4 text-[#8d253c]" />
                <span>1. Datos del Cliente & Envío</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Nombres y Apellidos Completos *
                  </label>
                  <input
                    id="input-checkout-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ej: Luciana Morales Valdivia"
                    className="w-full h-10 px-3 rounded-xl border border-rose-200 text-xs focus:ring-2 focus:ring-rose-400 focus:border-transparent outline-hidden bg-rose-50/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Teléfono / WhatsApp *
                  </label>
                  <input
                    id="input-checkout-phone"
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Ej: 987654321"
                    className="w-full h-10 px-3 rounded-xl border border-rose-200 text-xs focus:ring-2 focus:ring-rose-400 focus:border-transparent outline-hidden bg-rose-50/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Tipo y N° Documento *
                  </label>
                  <div className="flex space-x-1">
                    <select
                      id="select-checkout-doc-type"
                      value={documentType}
                      onChange={(e) => setDocumentType(e.target.value as any)}
                      className="h-10 px-2 rounded-xl border border-rose-200 text-xs bg-rose-50/40"
                    >
                      <option value="DNI">DNI</option>
                      <option value="CE">CE</option>
                      <option value="RUC">RUC</option>
                    </select>
                    <input
                      id="input-checkout-doc-number"
                      type="text"
                      required
                      value={documentNumber}
                      onChange={(e) => setDocumentNumber(e.target.value)}
                      placeholder="N° documento"
                      className="flex-1 h-10 px-3 rounded-xl border border-rose-200 text-xs focus:ring-2 focus:ring-rose-400 focus:border-transparent outline-hidden bg-rose-50/20"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Correo Electrónico (opcional)
                  </label>
                  <input
                    id="input-checkout-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Para el certificado digital de autenticidad"
                    className="w-full h-10 px-3 rounded-xl border border-rose-200 text-xs focus:ring-2 focus:ring-rose-400 focus:border-transparent outline-hidden bg-rose-50/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Departamento / Región *
                  </label>
                  <select
                    id="select-checkout-department"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-rose-200 text-xs bg-rose-50/40"
                  >
                    <option value="Lima">Lima</option>
                    <option value="Arequipa">Arequipa</option>
                    <option value="Cusco">Cusco</option>
                    <option value="La Libertad">La Libertad (Trujillo)</option>
                    <option value="Piura">Piura</option>
                    <option value="Lambayeque">Lambayeque (Chiclayo)</option>
                    <option value="Junín">Junín (Huancayo)</option>
                    <option value="Áncash">Áncash (Chimbote / Huaraz)</option>
                    <option value="Ica">Ica</option>
                    <option value="San Martín">San Martín (Tarapoto)</option>
                    <option value="Loreto">Loreto (Iquitos)</option>
                    <option value="Puno">Puno / Juliaca</option>
                    <option value="Tacna">Tacna</option>
                    <option value="Otro">Otro Departamento</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Distrito *
                  </label>
                  <input
                    id="input-checkout-district"
                    type="text"
                    required
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    placeholder="Ej: Miraflores, San Borja, Cayma..."
                    className="w-full h-10 px-3 rounded-xl border border-rose-200 text-xs focus:ring-2 focus:ring-rose-400 focus:border-transparent outline-hidden bg-rose-50/20"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Dirección Exacta (Calle, Av, Jr, N°, Dpto) *
                  </label>
                  <input
                    id="input-checkout-address"
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Ej: Av. Larco 745 Dpto 402"
                    className="w-full h-10 px-3 rounded-xl border border-rose-200 text-xs focus:ring-2 focus:ring-rose-400 focus:border-transparent outline-hidden bg-rose-50/20"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Referencia de Entrega
                  </label>
                  <input
                    id="input-checkout-reference"
                    type="text"
                    value={reference}
                    onChange={(e) => setReference(e.target.value)}
                    placeholder="Ej: Cerca al parque, edificio con conserje"
                    className="w-full h-10 px-3 rounded-xl border border-rose-200 text-xs focus:ring-2 focus:ring-rose-400 focus:border-transparent outline-hidden bg-rose-50/20"
                  />
                </div>
              </div>
            </div>

            {/* Right Column: Payment Method & QR Details (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="flex items-center space-x-2 text-neutral-900 font-bold text-sm border-b border-rose-100 pb-2">
                <CreditCard className="w-4 h-4 text-[#8d253c]" />
                <span>2. Método de Pago (QR Yape / Plin / Bancos)</span>
              </div>

              {/* Payment Tab Selector */}
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-rose-50/80 rounded-2xl border border-rose-200/80">
                <button
                  type="button"
                  id="tab-pay-yape"
                  onClick={() => setPaymentMethod('yape')}
                  className={`py-2 px-1 rounded-xl text-xs font-bold transition-all flex flex-col items-center justify-center cursor-pointer ${
                    paymentMethod === 'yape'
                      ? 'bg-[#742284] text-white shadow-sm'
                      : 'text-neutral-700 hover:text-neutral-900'
                  }`}
                >
                  <QrCode className="w-4 h-4 mb-0.5" />
                  <span>QR YAPE</span>
                </button>

                <button
                  type="button"
                  id="tab-pay-plin"
                  onClick={() => setPaymentMethod('plin')}
                  className={`py-2 px-1 rounded-xl text-xs font-bold transition-all flex flex-col items-center justify-center cursor-pointer ${
                    paymentMethod === 'plin'
                      ? 'bg-cyan-700 text-white shadow-sm'
                      : 'text-neutral-700 hover:text-neutral-900'
                  }`}
                >
                  <Smartphone className="w-4 h-4 mb-0.5" />
                  <span>PLIN</span>
                </button>

                <button
                  type="button"
                  id="tab-pay-transf"
                  onClick={() => setPaymentMethod('transferencia')}
                  className={`py-2 px-1 rounded-xl text-xs font-bold transition-all flex flex-col items-center justify-center cursor-pointer ${
                    paymentMethod === 'transferencia'
                      ? 'bg-neutral-900 text-white shadow-sm'
                      : 'text-neutral-700 hover:text-neutral-900'
                  }`}
                >
                  <Building2 className="w-4 h-4 mb-0.5" />
                  <span>BANCOS</span>
                </button>
              </div>

              {/* Payment Box Details with QR */}
              {paymentMethod === 'yape' && (
                <div className="space-y-3">
                  {/* Embedded Yape QR Card */}
                  <YapeQrCard amount={cartTotal} showBorder={false} />

                  <div className="bg-purple-50/80 border border-purple-200 rounded-2xl p-3">
                    <label className="block text-[11px] font-semibold text-purple-950 mb-1">
                      N° de Operación Yape o Referencia de Pago:
                    </label>
                    <input
                      id="input-yape-op-code"
                      type="text"
                      value={operationCode}
                      onChange={(e) => setOperationCode(e.target.value)}
                      placeholder="Ej: 948210 (6 dígitos de tu app Yape)"
                      className="w-full h-9 px-3 rounded-xl border border-purple-300 text-xs bg-white outline-hidden focus:ring-2 focus:ring-purple-400 font-mono"
                    />
                  </div>
                </div>
              )}

              {paymentMethod === 'plin' && (
                <div className="bg-cyan-50/70 border border-cyan-200 rounded-2xl p-3.5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-cyan-950 flex items-center">
                      <span className="w-2 h-2 rounded-full bg-cyan-600 mr-1.5" />
                      Paga con Plin (BBVA, Interbank, Scotiabank)
                    </span>
                    <span className="text-[10px] bg-cyan-200/60 text-cyan-800 font-semibold px-2 py-0.5 rounded-full">
                      Inmediato
                    </span>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-cyan-100 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-neutral-500 uppercase">Número Plin:</p>
                      <p className="font-mono font-black text-base text-cyan-900">{STORE_PHONE}</p>
                      <p className="text-[10px] text-neutral-600">Titular: {STORE_OWNER_NAME}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(STORE_PHONE, 'plin-phone')}
                      className="px-2.5 py-1.5 rounded-lg bg-cyan-100 hover:bg-cyan-200 text-cyan-800 text-xs font-bold flex items-center space-x-1 cursor-pointer"
                    >
                      {copiedField === 'plin-phone' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedField === 'plin-phone' ? 'Copiado' : 'Copiar'}</span>
                    </button>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-cyan-950 mb-1">
                      Código de Operación Plin:
                    </label>
                    <input
                      id="input-plin-op-code"
                      type="text"
                      value={operationCode}
                      onChange={(e) => setOperationCode(e.target.value)}
                      placeholder="Ej: 338210"
                      className="w-full h-9 px-3 rounded-xl border border-cyan-300 text-xs bg-white outline-hidden focus:ring-2 focus:ring-cyan-400"
                    />
                  </div>
                </div>
              )}

              {paymentMethod === 'transferencia' && (
                <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-3.5 space-y-3">
                  <span className="text-xs font-bold text-neutral-900 flex items-center">
                    <Building2 className="w-3.5 h-3.5 mr-1.5 text-neutral-700" />
                    Cuentas Bancarias Oficiales - {STORE_OWNER_NAME}
                  </span>

                  <div className="space-y-2">
                    {PAYMENT_DETAILS.transferencia.accounts.map((acc, index) => (
                      <div key={index} className="bg-white p-2.5 rounded-xl border border-neutral-200 text-xs">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-bold text-neutral-800">{acc.bank}</span>
                          <button
                            type="button"
                            onClick={() => handleCopy(acc.accountNumber, `acc-${index}`)}
                            className="text-[10px] font-semibold text-blue-600 hover:underline flex items-center cursor-pointer"
                          >
                            {copiedField === `acc-${index}` ? 'Copiado' : 'Copiar Cta'}
                          </button>
                        </div>
                        <p className="font-mono text-[11px] text-neutral-700">Cta: {acc.accountNumber}</p>
                        <p className="font-mono text-[10px] text-neutral-500">CCI: {acc.cci}</p>
                      </div>
                    ))}
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                      Banco Utilizado y N° de Operación:
                    </label>
                    <input
                      id="input-bank-op-code"
                      type="text"
                      value={operationCode}
                      onChange={(e) => setOperationCode(e.target.value)}
                      placeholder="Ej: BCP - Op 104928"
                      className="w-full h-9 px-3 rounded-xl border border-neutral-300 text-xs bg-white outline-hidden"
                    />
                  </div>
                </div>
              )}

              {/* Upload Voucher Screenshot (Optional preview) */}
              <div className="bg-rose-50/40 p-3 rounded-2xl border border-rose-100">
                <label className="block text-xs font-semibold text-neutral-700 mb-1 flex items-center justify-between">
                  <span>Adjuntar Captura de Comprobante</span>
                  <span className="text-[10px] text-neutral-500 font-normal">Opcional</span>
                </label>
                <div className="flex items-center space-x-2">
                  <label className="cursor-pointer px-3 py-1.5 rounded-xl border border-dashed border-rose-300 hover:border-rose-400 bg-white text-xs text-neutral-600 font-medium flex items-center space-x-1.5 transition-colors">
                    <Upload className="w-3.5 h-3.5 text-neutral-500" />
                    <span>Seleccionar comprobante</span>
                    <input
                      id="file-input-voucher"
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                  {voucherPreview && (
                    <div className="flex items-center space-x-1 text-xs text-emerald-600 font-semibold">
                      <Check className="w-3.5 h-3.5" />
                      <span>Comprobante listo</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Total & Submit Button */}
              <div className="pt-2 border-t border-rose-100">
                <div className="flex items-center justify-between mb-3 text-sm">
                  <span className="font-bold text-neutral-700">Total a Pagar:</span>
                  <span className="text-xl font-black text-[#8d253c] font-mono">S/ {cartTotal.toFixed(2)}</span>
                </div>

                <button
                  id="btn-submit-order-checkout"
                  type="submit"
                  disabled={isSubmitting || cart.length === 0}
                  className={`w-full py-3.5 rounded-2xl font-black text-sm flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                    isSubmitting
                      ? 'bg-neutral-400 text-white cursor-wait'
                      : 'bg-gradient-to-r from-[#be3e57] to-[#9d2d44] hover:from-[#aa324a] hover:to-[#882238] text-white shadow-md hover:shadow-lg'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isSubmitting ? 'Registrando Pedido...' : 'Confirmar Pedido de Joyas'}</span>
                </button>

                <p className="mt-2 text-center text-[11px] text-neutral-500">
                  Al confirmar, tu pedido se registrará automáticamente en la base de datos y se descontará el stock en taller.
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
