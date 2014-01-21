<?php

namespace Domis86\TranslatorBundle\DataCollector;

use Symfony\Component\HttpKernel\DataCollector\DataCollector;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Domis86\TranslatorBundle\Translation\LocationVO;
use Domis86\TranslatorBundle\Translation\MessageManager;


class TranslatorDataCollector extends DataCollector
{
    /**
     * @var MessageManager
     */
    private $messageManager;

    public function __construct(MessageManager $messageManager)
    {
        $this->messageManager = $messageManager;
    }

    /**
     * {@inheritdoc}
     */
    public function collect(Request $request, Response $response, \Exception $exception = null)
    {
        $this->messageManager->handleMissingObjects();
        $this->data = array('location' => $this->messageManager->getLocationOfMessages());
    }

    /**
     * @return LocationVO
     */
    public function getLocation()
    {
        return $this->data['location'];
    }

    /**
     * {@inheritdoc}
     */
    public function getName()
    {
        return 'domis86_translator_data_collector';
    }
}
