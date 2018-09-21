<?php

namespace Domis86\TranslatorBundle\Translation;

use Symfony\Component\Translation\MessageCatalogueInterface;
use Symfony\Component\Translation\MessageSelector;
use Symfony\Component\Translation\TranslatorBagInterface;
use Symfony\Component\Translation\TranslatorInterface;

/**
 * Translator
 *
 * @author Dominik Frankowicz <domis86@gmail.com>
 */
class Translator implements TranslatorInterface, TranslatorBagInterface
{
    /** @var bool */
    private $isEnabled = false;

    /**
     * @var TranslatorInterface $translator
     */
    private $parentTranslator;

    /**
     * @var MessageManager $messageManager
     */
    private $messageManager;

    /**
     * @var MessageSelector
     */
    private $selector;

    /**
     * @var array
     */
    private $ignoredDomains;

    private $domains_to_manualy_translate;

    public function __construct(MessageManager $messageManager, MessageSelector $selector = null, $ignoredDomains = array(),$translateScreenshot=false,$domains_to_manualy_translate)
    {
        $this->messageManager = $messageManager;
        $this->selector = $selector ? : new MessageSelector();
        $this->ignoredDomains = $ignoredDomains;
        $this->translateScreenshot = $translateScreenshot;
        $this->domains_to_manualy_translate = $domains_to_manualy_translate;
    }

    public function enable()
    {
        $this->isEnabled = true;
    }

    public function isEnabled()
    {
        return $this->isEnabled;
    }

    /**
     * {@inheritdoc}
     */
    public function trans($id, array $parameters = array(), $domain = null, $locale = null)
    {
        if (!$locale) {
            $locale = $this->getLocale();
        }
        if ($this->isEnabled() && !$this->isIgnoredDomain($domain) && $translation = $this->messageManager->translateMessage($id, $domain, $locale)) {
            if (empty($parameters)) {
                $ret=$translation;
            } else {
                $ret=strtr($translation, $parameters);
            }
        } else {
            $ret= $this->parentTranslator->trans($id, $parameters, $domain, $locale);
        }
        if (($this->translateScreenshot) && (! preg_match("/preg_/",$id)) && (($domain==null) || (in_array($domain,$this->domains_to_manualy_translate)))) {
            $beginCar="𝅳"; //U1D173
            $middleCar="-"; //U1D175
            $endCar="𝅴"; //U1D174
            return $beginCar.$id.$middleCar.$domain.$middleCar.$locale.$middleCar."[".$ret."]".$endCar.$id.$endCar;     
        } else {
            return $ret;
        }
    }

    /**
     * {@inheritdoc}
     */
    public function transChoice($id, $number, array $parameters = array(), $domain = null, $locale = null)
    {
        if (!$locale) {
            $locale = $this->getLocale();
        }
        if ($this->isEnabled() && !$this->isIgnoredDomain($domain) && $translation = $this->messageManager->translateMessage($id, $domain, $locale)) {
            $translation = $this->selector->choose($translation, (int)$number, $locale);
            if (empty($parameters)) {
                $ret=$translation;
            } else {
                $ret=strtr($translation, $parameters);
            }
        } else {
            $ret= $this->parentTranslator->transChoice($id, $number, $parameters, $domain, $locale);
        }
        if (($this->translateScreenshot) && (! preg_match("/preg_/",$id)) && (($domain==null) || (in_array($domain,$this->domains_to_manualy_translate)))) {
            $beginCar="𝅳"; //U1D173
            $middleCar="-"; //U1D175
            $endCar="𝅴"; //U1D174
            return $beginCar.$id.$middleCar.$domain.$middleCar.$locale.$middleCar."[".$ret."]".$endCar.$id.$endCar;     
        } else {
            return $ret;
        }
    }

    /**
     * {@inheritdoc}
     */
    public function setLocale($locale)
    {
        $this->parentTranslator->setLocale($locale);
    }

    /**
     * {@inheritdoc}
     */
    public function getLocale()
    {
        return $this->parentTranslator->getLocale();
    }

    /**
     * @param TranslatorInterface $parentTranslator
     */
    public function setParentTranslator(TranslatorInterface $parentTranslator)
    {
        $this->parentTranslator = $parentTranslator;
    }

    /**
     * @param string $domain
     * @return bool
     */
    private function isIgnoredDomain($domain)
    {
        return in_array($domain, $this->ignoredDomains);
    }

    /**
     * Gets the catalogue by locale.
     *
     * @param string|null $locale The locale or null to use the default
     *
     * @throws \InvalidArgumentException If the locale contains invalid characters
     *
     * @return MessageCatalogueInterface
     */
    public function getCatalogue($locale = null)
    {
        return $this->parentTranslator->getCatalogue($locale);
        if (null === $locale) {
            $locale = $this->getLocale();
        } else {
            //$this->assertValidLocale($locale); TODO: domis86-2.7
        }

        if (!isset($this->catalogues[$locale])) {
            $this->loadCatalogue($locale);
        }

        return $this->catalogues[$locale];
    }
}
