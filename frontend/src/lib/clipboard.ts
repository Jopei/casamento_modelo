/**
 * navigator.clipboard so existe em contexto seguro (HTTPS ou localhost).
 * Num site publicado em HTTP, ou aberto pelo IP da rede, ele vem undefined
 * e o botao de copiar falha calado. O fallback usa a selecao + execCommand,
 * que e obsoleto porem ainda funciona em todos os navegadores atuais.
 */
export async function copyText(text: string): Promise<boolean> {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Cai no fallback abaixo.
    }
  }

  try {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    // Fora da tela e somente leitura para nao dar zoom nem abrir teclado no iOS.
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.top = "-1000px";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);

    textarea.select();
    textarea.setSelectionRange(0, text.length);

    const copied = document.execCommand("copy");
    document.body.removeChild(textarea);

    return copied;
  } catch {
    return false;
  }
}
