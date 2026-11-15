(() => {
 const form = document.querySelector("#contact-form");
 if (!form) return;
 form.addEventListener("submit", event => {
   event.preventDefault();
   if (!form.reportValidity()) return;
   const value = name => form.elements.namedItem(name).value.trim();
   const subject = value("oggetto").replace(/[\r\n]+/g, " ");
   const body = value("messaggio") + "\n\n—\n" + value("nome") + "\nEmail: " + value("email");
   const url = "mailto:novecentocafe.900@gmail.com?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
   document.querySelector("#contact-status").textContent = "Apertura del programma di posta. Il messaggio non è ancora stato inviato: controllalo e invialo da lì. Se non si apre, scrivi a novecentocafe.900@gmail.com.";
   window.location.href = url;
 });
})();