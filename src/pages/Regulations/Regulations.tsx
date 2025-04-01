import { FC } from 'react'
import classes from './Regulations.module.css'
import { useNavigate } from 'react-router-dom'
import { IoIosArrowBack } from 'react-icons/io'
import AnimatedPage from '../../components/animations/AnimatedPage/AnimatedPage'
import TappedComponent from '../../components/animations/TappedComponent/TappedComponent'

type Props = {
  publicAccess?: boolean
}

/**
 * Page display regulation file assigned to current shop. Runs in 2 contexts:
 *
 * <ul>
 *     <li>If public access equal false, is displayed without "back" icon
 *     ( this functionality is provided by Header component )</li>
 *     <li>If public access equal true, is displayed with "back" icon</li>
 * </ul>
 *
 * TODO: When a public layout is created, a "back" icon should be provided by the layout.
 * TODO: Content should be loaded dynamically from the file
 */
const Regulations: FC<Props> = ({ publicAccess = false }) => {
  const navigation = useNavigate()

  return (
    <AnimatedPage>
      {publicAccess && (
        <TappedComponent styles={{ height: '50px' }}>
          <IoIosArrowBack className={classes['step-back-icon']} size={40} onClick={() => navigation(-1)} />
        </TappedComponent>
      )}
      <div className={classes.container}>
        <h1 style={{ textAlign: 'center' }}>Regulamin aplikacji mobilnej Vape Shop</h1>
        <ol className={classes['main-list']}>
          <li style={{ listStyle: 'none' }}>
            <h2>§ 1 Postanowienia ogólne</h2>
            <ol>
              <li>
                Niniejszy Regulamin (zwany dalej „Regulamin”) określa zasady, zakres i warunki korzystania z aplikacji
                mobilnej Vape Shop (zwana dalej „Aplikacją”) i odnosi się do wszystkich stosunków pomiędzy Użytkownikiem
                a Operatorem Aplikacji.
              </li>
              <li>
                Regulamin dotyczy usług świadczonych drogą elektroniczną za pośrednictwem Aplikacji przez Vape Shop
                Tychy., z siedzibą w Tychach, ul. Grota Roweckiego, 43-100 Tychy, NIP 6462433268 (zwana dalej
                „Operatorem”).
              </li>
              <li>
                Użytkownikiem jest każda osoba fizyczna korzystająca z usług świadczonych za pośrednictwem Aplikacji.
              </li>
              <li>
                Do usług świadczonych za pośrednictwem Aplikacji należą w szczególności:
                <ul style={{ listStyleType: 'lower-alpha' }}>
                  <li>publikowanie aktualnych ofert oraz promocji</li>
                  <li>Wymiana zebranych punktów lojalnościowych na produkt który jest objęty promocją</li>
                  <li>Dostęp do historii zakupów</li>
                </ul>
              </li>
              <li>
                Uczestnik może uzyskiwać punkty w Programie wyłącznie za te zakupy, których sam dokonał. Punkty są
                przyznawane wyłącznie za zakupy dokonane przez Uczestnika w czasie jego udziału w Programie. Warunkiem
                przyznania punktów za zakupy jest ich opłacenie. W przypadku nieopłacenia zakupów, Operator zastrzega
                sobie prawo do odliczenia punktów uprzednio naliczonych za takie zakupy.
              </li>
              <li>
                Punkty są przyznawane wyłącznie za zakupy dokonane w Sklepie i zamówienia za pośrednictwem Aplikacji.
                <ol style={{ listStyleType: 'lower-alpha' }}>
                  <li>
                    Klient otrzymuje punkty za każdy dokonany zakup zgodnie z zasadami ustalonymi przez Operatora za
                    każdego wydanego 5 zł (pięć złotych) Klient otrzymuje 1 punkt.
                  </li>
                  <li>
                    Każdy punkt na koncie Klienta może zostać wymieniony przez Klienta na produkty zgodnie z zasadami
                    ustalonymi przez Operatora. Punkty można wymieniać wyłącznie w ramach działalności Użytkownika. Za
                    każde pełne 5 zł (pięć złotych) ceny produktów zakupionych przez Uczestnika w Sklepie lub
                    zamówionych za pośrednictwem Aplikacji przysługują temu Uczestnikowi 1 punkt. Podstawą naliczenia
                    punktów jest suma brutto widoczna na paragonie fiskalnym lub elektronicznym obrazie paragonu
                    zaokrąglona w dół do pełnego złotego.
                  </li>
                </ol>
              </li>
              <li>
                Uczestnikiem Programu może być wyłącznie osoba fizyczna, która łącznie spełnia poniższe warunki:
                <ol style={{ listStyleType: 'lower-alpha' }}>
                  <li>Ukończyła 18-ty rok życia i posiada co najmniej ograniczoną zdolność do czynności prawnych;</li>
                  <li>Jest Konsument</li>
                  <li>Posiada aktywną skrzynkę poczty elektronicznej (e-mail);</li>
                </ol>
              </li>
              <li>Aplikacja przeznaczona jest na urządzenia mobilne z systemem operacyjnym iOS, Android.</li>
              <li>
                Pobranie Aplikacji oraz korzystanie z oferowanych za jej pośrednictwem usług jest bezpłatne.
                <ol style={{ listStyleType: 'lower-alpha' }}>
                  <li>
                    Do pobrania, instalacji, uruchomienia i korzystania z Aplikacji wymagane jest połączenie z
                    Internetem. Wszelkie koszty połączenia z Internetem, w szczególności transmisji danych, pokrywa
                    Użytkownik we własnym zakresie, stosownie do umów zawartych przez Użytkownika z operatorami
                    telekomunikacyjnymi lub innym dostawcą Internetu. Operator nie ponosi odpowiedzialności za
                    niewykonanie lub nienależyte wykonanie usług przez operatorów telekomunikacyjnych lub innych
                    dostawców Internetu, z którymi Użytkownik ma zawarte umowy.
                  </li>
                </ol>
              </li>
              <li>
                Wszelkie materiały udostępniane w Aplikacji, w szczególności teksty, zdjęcia, materiały filmowe i
                dźwiękowe, stanowią wyłączną własność Operatora, bądź podmiotów z którymi Operator zawarł stosowną
                umowę.
              </li>
            </ol>
          </li>
          <li style={{ listStyle: 'none' }}>
            <h2>§ 2 Rejestracja i wymagania techniczne</h2>
            <ol>
              <li>
                Rejestracja w Aplikacji odbywa się poprzez wypełnienie formularza rejestracyjnego, w którym Użytkownik
                zobowiązany jest podać indywidualną nazwę Użytkownika oraz hasło otrzymanego z Vape Shop.
              </li>
              <li>
                Urządzenie mobilne, na którym Użytkownik uruchomi pobraną i zainstalowaną Aplikację, musi spełniać
                następujące wymagania techniczne: iOS w wersji minimum (iOS 10), Android w wersji minimum (Android 4.1).
              </li>
              <li>Do uruchomienia i prawidłowego działania Aplikacji niezbędne jest aktywne połączenie internetowe.</li>
              <li>Rejestracja w Aplikacji jest jednoznaczna z akceptacją treści Regulaminu przez Użytkownika</li>
              <li>
                Aplikacja jest wersją testowa i moga wystapic błędy za które Operator nie ponosi odpowiedzialności.
              </li>
            </ol>
          </li>
          <li style={{ listStyle: 'none' }}>
            <h2>§ 3 Zasady korzystania z Aplikacji przez Użytkownika</h2>
            <ol>
              <li>
                Korzystanie przez Użytkownika z Aplikacji w inny sposób niż w ramach dozwolonego użytku jest
                niedopuszczalne bez wyraźnej zgody Operatora.
              </li>
              <li>
                Użytkownik zobowiązany jest powiadomić Operatora o każdorazowym naruszeniu jego praw w związku z
                korzystaniem z Aplikacji.
              </li>
              <li>Użytkownik korzysta z Aplikacji dobrowolnie, na własną odpowiedzialność.</li>
              <li>
                Użytkownik ma prawo w każdej chwili zakończyć korzystanie z Aplikacji, w szczególności w sytuacji braku
                akceptacji Użytkownika na zmianę Regulaminu, Polityki Prywatności.
              </li>
              <li>
                Wszystkie błędy występujące w aplikacji użytkownik może zgłosić do Administratora aplikacji który
                znajduje się w Tychach przy ulicy Grota Roweckiego 30 - Vape Shop tychy
              </li>
            </ol>
          </li>
          <li style={{ listStyle: 'none' }}>
            <h2>§ 4 Polityka prywatności</h2>
            <ol>
              <li>
                Dane Użytkowników zawarte w Aplikacji oraz dane kontaktowe wprowadzone przez Użytkownika do Aplikacji są
                zapisywane wyłącznie na Urządzeniu Końcowym Użytkownika. Administrator nie gromadzi i nie przetwarza ww.
                danych.
              </li>
            </ol>
          </li>
          <li style={{ listStyle: 'none' }}>
            <h2>§ 5 Prawa i obowiązki Operatora</h2>
            <ol>
              <li>Operator zobowiązuje się sprawować nadzór nad technicznym funkcjonowaniem Aplikacji.</li>
              <li>
                Operator nie gwarantuje niezakłóconego dostępu do Aplikacji oraz nie zapewnia stałej dostępności
                wszystkich funkcji Aplikacji i ich bezbłędnego działania.
              </li>
              <li>
                Operator nie ponosi odpowiedzialności za jakiekolwiek szkody i utracone korzyści poniesione przez
                Użytkownika w związku:
                <ol style={{ listStyleType: 'lower-alpha' }}>
                  <li>
                    funkcjonowaniem Aplikacji, w szczególności zakłóceniem dostępności wszystkich funkcji Aplikacji bądź
                    ich błędnym działaniem,
                  </li>
                  <li>naruszeniem przez Użytkownika praw osób trzecich,</li>
                  <li>
                    funkcjonowaniem interfejsów oraz łączy telekomunikacyjnych, które nie są własnością Operatora lub
                    nie są przez niego obsługiwane,
                  </li>
                  <li>
                    usługami, aplikacjami i serwisami internetowymi, które nie są własnością Operatora lub nie są przez
                    niego obsługiwane.
                  </li>
                </ol>
              </li>
              <li>
                Operator ma prawo zablokować konto Użytkownika, jeżeli poweźmie uzasadnione podejrzenie, że Użytkownik
                korzysta z Aplikacji sprzecznie z zasadami określonymi w § 5 Regulaminu.
              </li>
              <li>
                Operator ma prawo czasowo zawiesić działanie Aplikacji, celem przeprowadzenia konsekwencji technicznej
                Aplikacji, dokonania zmian w działaniu Aplikacji, bądź zapobieżeniu ewentualnym szkodom.
              </li>
              <li>
                W każdej chwili Operator może zawiesić lub wyłączyć aplikacje nie podając żadnego powodu jej wyłączenia.
              </li>
              <li>
                Operator zastrzega sobie prawo zmiany Regulaminu, Polityki Prywatności oraz modyfikacji Aplikacji.
              </li>
            </ol>
          </li>
        </ol>
      </div>
    </AnimatedPage>
  )
}

export default Regulations
